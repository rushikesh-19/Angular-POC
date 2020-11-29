const Sequelize = require('sequelize')
const db = {}
const sequelize = new Sequelize('userdata', 'root', 'rishimax', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: 1,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db