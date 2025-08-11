module.exports = (sequelize, DataTypes) => {
  const BookingParticipant = sequelize.define('BookingParticipant', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    booking_id: { type: DataTypes.UUID, allowNull: false },
    user_id: { type: DataTypes.UUID, allowNull: false },
    role: { type: DataTypes.TEXT, defaultValue: 'player' },
    status: { type: DataTypes.TEXT, defaultValue: 'joined' },
    joined_at: { type: DataTypes.DATE }
  }, {
    tableName: 'booking_participants',
    timestamps: false,
    indexes: [
      { fields: ['booking_id'] },
      { fields: ['user_id'] }
    ]
  });

  BookingParticipant.associate = (models) => {
    BookingParticipant.belongsTo(models.Booking, { foreignKey: 'booking_id', as: 'booking' });
    BookingParticipant.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return BookingParticipant;
};

