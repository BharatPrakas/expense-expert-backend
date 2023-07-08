'use strict';
// Define a model for employee table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('earned', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    earnedcategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
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
    tableName: 'earned'
  });
  // Adding a class level method.
  Model.associate = function (models) {
    this.userId = this.belongsTo(models.users);
    this.earnedcategoryId = this.belongsTo(models.earnedcategory);
  };
  return Model;
};