'use strict';

// Define a model for role table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('budget', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    limit: {
      defaultValue: 0,
      type: DataTypes.INTEGER,
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
    tableName: 'budget'
  });
  // Adding a class level method.
  Model.associate = function (models) {
    this.userId = this.belongsTo(models.users);
    this.categoryId = this.belongsTo(models.categories);
  };
  return Model;
};