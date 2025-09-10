const {DataTypes} = require('sequelize') ;
const sequelize = require('../config/database.js') ;

const users = sequelize.define('users', {
  username: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  bio: DataTypes.STRING,
  skills: DataTypes.STRING,
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}) ;

module.exports = users ;