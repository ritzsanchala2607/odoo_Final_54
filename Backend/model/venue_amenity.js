module.exports = (sequelize, DataTypes) => {
  const VenueAmenity = sequelize.define('VenueAmenity', {
    venue_id: { type: DataTypes.UUID, allowNull: false },
    amenity_id: { type: DataTypes.UUID, allowNull: false }
  }, {
    tableName: 'venue_amenity',
    timestamps: true
  });

  VenueAmenity.associate = (models) => {
    
  };

  return VenueAmenity;
};
