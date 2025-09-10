const {DataTypes} = require("sequelize") ;
const sequelize = require("../config/database.js") ;
const users = require("./users") ;

const swap = sequelize.define("swap" , {
    senderid: DataTypes.INTEGER,
    skilloffer: DataTypes.STRING,
    receiverid: DataTypes.INTEGER,
    skillgiven: DataTypes.STRING,
    status: {type: DataTypes.STRING , defaultValue: "pending"}
});

users.hasMany(swap, { foreignKey: 'senderid', as: 'SentRequests' });
users.hasMany(swap, { foreignKey: 'receiverid', as: 'ReceivedRequests' });

module.exports = swap;