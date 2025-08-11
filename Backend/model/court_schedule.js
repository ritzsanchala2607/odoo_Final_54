module.exports = (sequelize, DataTypes) => {
  const CourtSchedule = sequelize.define('CourtSchedule', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    court_id: { type: DataTypes.UUID },
    weekday: { type: DataTypes.SMALLINT, allowNull: false },
    start_time: { type: DataTypes.TIME, allowNull: false },
    end_time: { type: DataTypes.TIME, allowNull: false },
    slot_interval_minutes: { type: DataTypes.SMALLINT, defaultValue: 60 },
    price_multiplier: { type: DataTypes.DECIMAL(5, 2), defaultValue: 1.0 },
    created_at: { type: DataTypes.DATE }
  }, {
    tableName: 'court_schedules',
    timestamps: false
  });

  CourtSchedule.associate = (models) => {
    CourtSchedule.belongsTo(models.Court, { foreignKey: 'court_id', as: 'court' });
  };

  return CourtSchedule;
};

