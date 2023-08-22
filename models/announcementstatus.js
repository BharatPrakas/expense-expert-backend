'use strict';
// Define a model for role table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('announcementstatus', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    announcementId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    modified: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    tableName: 'announcementstatus'
  });
  // Adding a class level method.
  Model.associate = function (models) {
    this.announcementId = this.belongsTo(models.announcement);
  };
  return Model;
};