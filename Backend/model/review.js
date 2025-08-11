module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    venue_id: { type: DataTypes.UUID },
    user_id: { type: DataTypes.UUID },
    rating: { type: DataTypes.SMALLINT, allowNull: false },
    title: { type: DataTypes.TEXT },
    body: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE }
  }, {
    tableName: 'reviews',
    timestamps: false
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Venue, { foreignKey: 'venue_id', as: 'venue' });
    Review.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return Review;
};

