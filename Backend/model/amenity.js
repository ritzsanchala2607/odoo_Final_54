module.exports = (sequelize, DataTypes) => {
  const Amenity = sequelize.define('Amenity', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.TEXT, allowNull: false }
  }, {
    tableName: 'amenities',
    timestamps: false
  });

  Amenity.associate = (models) => {
    Amenity.belongsToMany(models.Venue, { through: models.VenueAmenity, foreignKey: 'amenity_id', as: 'venues' });
  };

  return Amenity;
};
