module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    booking_ref: { type: DataTypes.TEXT, allowNull: false, unique: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    court_id: { type: DataTypes.UUID, allowNull: false },
    venue_id: { type: DataTypes.UUID, allowNull: false },
    start_at: { type: DataTypes.DATE, allowNull: false },
    end_at: { type: DataTypes.DATE, allowNull: false },
    visibility: { type: DataTypes.TEXT, defaultValue: 'private' },
    player_capacity: { type: DataTypes.SMALLINT },
    allow_auto_join: { type: DataTypes.BOOLEAN, defaultValue: true },
    join_code: { type: DataTypes.TEXT, unique: true },
    host_notes: { type: DataTypes.TEXT },
    status: { type: DataTypes.TEXT, defaultValue: 'confirmed' },
    pricing_mode: { type: DataTypes.TEXT, defaultValue: 'per_hour' },
    unit_price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    effective_refund_ratio: { type: DataTypes.DECIMAL(5, 2) },
    total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    payment_id: { type: DataTypes.UUID },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE },
    cancelled_at: { type: DataTypes.DATE },
    cancel_reason: { type: DataTypes.TEXT }
  }, {
    tableName: 'bookings',
    timestamps: false
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Booking.belongsTo(models.Court, { foreignKey: 'court_id', as: 'court' });
    Booking.belongsTo(models.Venue, { foreignKey: 'venue_id', as: 'venue' });
    Booking.belongsTo(models.Payment, { foreignKey: 'payment_id', as: 'payment' });
    Booking.hasMany(models.BookingParticipant, { foreignKey: 'booking_id', as: 'participants' });
  };

  return Booking;
};

