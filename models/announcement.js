'use strict';
// Define a model for role table
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('announcement', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    viewed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    content: {
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
    tableName: 'announcement'
  });
  // Adding a class level method.
  Model.associate = function (models) {
  };
  return Model;
};