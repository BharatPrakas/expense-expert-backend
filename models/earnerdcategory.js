'use strict';

// Define a model for role table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('earnedcategory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
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
    tableName: 'earnedcategory'
  });
  // Adding a class level method.
  Model.associate = function (models) {
    this.userId = this.belongsTo(models.users);
    this.earned = this.hasMany(models.earned);
  };
  return Model;
};