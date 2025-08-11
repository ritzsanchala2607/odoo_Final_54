module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    booking_id: { type: DataTypes.UUID, unique: true },
    method: { type: DataTypes.TEXT },
    amount: { type: DataTypes.DECIMAL(10, 2) },
    currency: { type: DataTypes.TEXT, defaultValue: 'INR' },
    status: { type: DataTypes.TEXT },
    provider_txn_id: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE }
  }, {
    tableName: 'payments',
    timestamps: false
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Booking, { foreignKey: 'booking_id', as: 'booking' });
  };

  return Payment;
};

