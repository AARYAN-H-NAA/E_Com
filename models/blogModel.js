'use strict';
const { Model, } = require('sequelize');
const User = require('./userModel');

module.exports = (sequelize, DataTypes) => {class Blog extends Model {
  static associate(models) {
    Blog.belongsToMany(models.User, { through: 'BlogLikes', as: 'likes' });
    Blog.belongsToMany(models.User, { through: 'BlogDislikes', as: 'dislikes' });
  }
}

Blog.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numViews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isLiked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isDisliked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    author: {
      type: DataTypes.STRING,
      defaultValue: 'Admin',
    },
  },
  {
    sequelize,
    modelName: 'Blog',
    timestamps: true,
  }
);
return Blog
}
