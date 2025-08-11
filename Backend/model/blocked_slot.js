module.exports = (sequelize, DataTypes) => {
  const BlockedSlot = sequelize.define('BlockedSlot', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    court_id: { type: DataTypes.UUID },
    start_at: { type: DataTypes.DATE, allowNull: false },
    end_at: { type: DataTypes.DATE, allowNull: false },
    reason: { type: DataTypes.TEXT },
    created_by: { type: DataTypes.UUID },
    created_at: { type: DataTypes.DATE }
  }, {
    tableName: 'blocked_slots',
    timestamps: false
  });

  BlockedSlot.associate = (models) => {
    BlockedSlot.belongsTo(models.Court, { foreignKey: 'court_id', as: 'court' });
    BlockedSlot.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
  };

  return BlockedSlot;
};

