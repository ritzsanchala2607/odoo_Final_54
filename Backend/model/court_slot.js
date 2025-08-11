module.exports = (sequelize, DataTypes) => {
  const CourtSlot = sequelize.define('CourtSlot', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    court_id: { type: DataTypes.UUID, allowNull: false },
    start_at: { type: DataTypes.DATE, allowNull: false },
    end_at: { type: DataTypes.DATE, allowNull: false },
    base_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    is_blocked: { type: DataTypes.BOOLEAN, defaultValue: false },
    slot_status: { type: DataTypes.TEXT, defaultValue: 'available' },
    created_at: { type: DataTypes.DATE }
  }, {
    tableName: 'court_slots',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['court_id', 'start_at', 'end_at'] }
    ]
  });

  CourtSlot.associate = (models) => {
    CourtSlot.belongsTo(models.Court, { foreignKey: 'court_id', as: 'court' });
    CourtSlot.hasMany(models.Booking, { foreignKey: 'court_id', sourceKey: 'court_id' });
  };

  return CourtSlot;
};

