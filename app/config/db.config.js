const env = require('./env.js');
 
const Sequelize = require('sequelize');
const sObj = new Sequelize("leadx_poc", "root", "iprogrammer123#", {
  host: "localhost",
  dialect: "mysql",
  operatorsAliases: false,
  pool: {
    max: env.max,
    min: env.min,
    acquire: env.acquire,
    idle: env.idle
  }
});
 
const db = {};
 
db.Sequelize = Sequelize;
db.sObj = sObj;
db.key = "7u8i9o0p";

// Sequelize.prototype.query = function () {
//   return originalQuery.apply(this, arguments).catch(function (err) {
//     // log the error 
//     console.log("+++++ Global Error +++++", err);
//     throw err;
//   });
// };
 
//Models/tables
db.customers = require('../model/customer.model.js')(sObj, Sequelize);
 
 
module.exports = db;