module.exports = (sequelize, DataTypes) => {
  const Court = sequelize.define('Court', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    venue_id: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.TEXT, allowNull: false },
    sport_type: { type: DataTypes.TEXT, allowNull: false },
    price_per_hour: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    capacity: { type: DataTypes.INTEGER, defaultValue: 1 },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'courts',
    timestamps: false
  });

  Court.associate = (models) => {
    Court.belongsTo(models.Venue, { foreignKey: 'venue_id', as: 'venue' });
    Court.hasMany(models.CourtSchedule, { foreignKey: 'court_id', as: 'schedules' });
    Court.hasMany(models.CourtSlot, { foreignKey: 'court_id', as: 'slots' });
    Court.hasMany(models.BlockedSlot, { foreignKey: 'court_id', as: 'blocked_slots' });
    Court.hasMany(models.Booking, { foreignKey: 'court_id', as: 'bookings' });
  };

  return Court;
};
