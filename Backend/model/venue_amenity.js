module.exports = (sequelize, DataTypes) => {
  const VenueAmenity = sequelize.define('VenueAmenity', {
    venue_id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    amenity_id: { type: DataTypes.UUID, allowNull: false, primaryKey: true }
  }, {
    tableName: 'venue_amenities',
    timestamps: false
  });

  VenueAmenity.associate = (models) => {
    // join table associations handled in Venue and Amenity
  };

  return VenueAmenity;
};
