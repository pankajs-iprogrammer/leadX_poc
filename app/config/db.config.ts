const env = require('./env');
 
const Sequelize = require('sequelize');
export const sObj = new Sequelize("leadx_poc", "root", "root", {
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
 
const db = {
  "Sequelize":Sequelize,
  "sObj": sObj,
  "key": "7u8i9o0p"
};
 

// Sequelize.prototype.query = function () {
//   return originalQuery.apply(this, arguments).catch(function (err) {
//     // log the error 
//     console.log("+++++ Global Error +++++", err);
//     throw err;
//   });
// };
 
//Models/tables

 
 
// module.exports = db;
export default db;