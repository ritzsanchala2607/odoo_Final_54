module.exports = (sequelize, DataTypes) => {
  const CreditTransaction = sequelize.define('CreditTransaction', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    booking_id: { type: DataTypes.UUID },
    amount: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.TEXT, allowNull: false },
    reason: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE }
  }, {
    tableName: 'credit_transactions',
    timestamps: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['booking_id'] }
    ]
  });

  CreditTransaction.associate = (models) => {
    CreditTransaction.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    CreditTransaction.belongsTo(models.Booking, { foreignKey: 'booking_id', as: 'booking' });
  };

  return CreditTransaction;
};

