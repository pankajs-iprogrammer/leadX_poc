//import { env } from './env';
import * as Sequelize from "sequelize";
import * as dotenv from "dotenv";
dotenv.config();

export const sObj = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        operatorsAliases: false,
        define: {
            charset: "utf8",
            collate: "utf8_general_ci",
            timestamps: true
        },
        pool: {
            max: process.env.POOL_MAX,
            min: process.env.POOL_MIN,
            acquire: process.env.POOL_ACQUIRE,
            idle: process.env.POOL_IDLE
        }
    }
);

// Sequelize.addHook("afterInit", function(sequelize) {
//     sequelize.options.handleDisconnects = false;
//     console.log("++++++++Sequelize Hook+++++++ ");
//     // Disable pool completely
//     sequelize.connectionManager.pool.clear();
//     sequelize.connectionManager.pool = null;
//     sequelize.connectionManager.getConnection = function getConnection() {
//         return this._connect(sequelize.config);
//     };
//     sequelize.connectionManager.releaseConnection = function releaseConnection(
//         connection
//     ) {
//         return this._disconnect(connection);
//     };
// });

const db = {
    key: "7u8i9o0p",
    Sequelize,
    sObj
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
