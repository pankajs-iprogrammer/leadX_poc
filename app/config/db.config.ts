import { env } from './env';
import * as Sequelize from 'sequelize';

export const sObj = new Sequelize("leadx_poc", "root", "7u8i9o0p", {
  host: "localhost",
  dialect: "mysql",
  operatorsAliases: false,
  pool: {
    max: env.pool.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle,
  },
});
 
const db = {
  "key" : "7u8i9o0p",
  Sequelize,
  sObj,
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
