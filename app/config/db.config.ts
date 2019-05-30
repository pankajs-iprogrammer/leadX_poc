//import { env } from './env';
import * as Sequelize from "sequelize";
import * as dotenv from "dotenv";
dotenv.config();

const Op = Sequelize.Op;
const operatorsAliases = {
    $eq: Op.eq,
    $ne: Op.ne,
    $gte: Op.gte,
    $gt: Op.gt,
    $lte: Op.lte,
    $lt: Op.lt,
    $not: Op.not,
    $in: Op.in,
    $notIn: Op.notIn,
    $is: Op.is,
    $like: Op.like,
    $notLike: Op.notLike,
    $iLike: Op.iLike,
    $notILike: Op.notILike,
    $regexp: Op.regexp,
    $notRegexp: Op.notRegexp,
    $iRegexp: Op.iRegexp,
    $notIRegexp: Op.notIRegexp,
    $between: Op.between,
    $notBetween: Op.notBetween,
    $overlap: Op.overlap,
    $contains: Op.contains,
    $contained: Op.contained,
    $adjacent: Op.adjacent,
    $strictLeft: Op.strictLeft,
    $strictRight: Op.strictRight,
    $noExtendRight: Op.noExtendRight,
    $noExtendLeft: Op.noExtendLeft,
    $and: Op.and,
    $or: Op.or,
    $any: Op.any,
    $all: Op.all,
    $values: Op.values,
    $col: Op.col
};

export const sObj = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        operatorsAliases,
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
