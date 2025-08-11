module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    actor_id: { type: DataTypes.UUID },
    object_type: { type: DataTypes.TEXT },
    object_id: { type: DataTypes.UUID },
    action: { type: DataTypes.TEXT },
    payload: { type: DataTypes.JSONB },
    created_at: { type: DataTypes.DATE }
  }, {
    tableName: 'audit_logs',
    timestamps: false
  });

  AuditLog.associate = (models) => {
    AuditLog.belongsTo(models.User, { foreignKey: 'actor_id', as: 'actor' });
  };

  return AuditLog;
};

