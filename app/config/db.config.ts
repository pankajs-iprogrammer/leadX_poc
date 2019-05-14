const env = require("./env");
const Sequelize = require("sequelize");

export const sObj = new Sequelize("leadx_poc", "root", "7u8i9o0p", {
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
  Sequelize,
  sObj,
  "key" : "7u8i9o0p"
};
 
export default db;