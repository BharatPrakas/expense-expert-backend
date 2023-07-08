'use strict';

// Define a model for role table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('categories', {
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
    color: {
      type: DataTypes.STRING,
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true
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
    tableName: 'categories'
  });
  // Adding a class level method.
  Model.associate = function (models) {
    this.userId = this.belongsTo(models.users);
    this.expense = this.hasMany(models.expense);
    this.budget = this.hasMany(models.budget);
  };
  return Model;
};