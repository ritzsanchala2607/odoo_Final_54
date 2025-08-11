const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db.config');

let sequelize;
const commonOptions = {
  dialect: 'postgres',
  logging: (process.env.DB_LOGGING || 'false').toLowerCase() === 'true',
  dialectOptions: dbConfig.ssl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
};

if (dbConfig.url) {
  sequelize = new Sequelize(dbConfig.url, commonOptions);
} else {
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    ...commonOptions,
  });
}

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Load models
const fs = require('fs');
const path = require('path');
const modelsDir = path.join(__dirname, '..', 'model');

fs.readdirSync(modelsDir)
  .filter((file) => file.endsWith('.js'))
  .forEach((file) => {
    const modelFactory = require(path.join(modelsDir, file));
    const model = modelFactory(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Setup associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Optional: authenticate and auto-sync tables based on .env flags
(async () => {
  try {
    await sequelize.authenticate();
    if ((process.env.DB_SYNC || 'false').toLowerCase() === 'true') {
      await sequelize.sync({ alter: (process.env.DB_SYNC_ALTER || 'false').toLowerCase() === 'true' });
      // eslint-disable-next-line no-console
      console.log('[DB] Synced models to database');
    }
    // eslint-disable-next-line no-console
    console.log('[DB] Connection established');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[DB] Connection error:', err.message);
  }
})();

module.exports = db;

