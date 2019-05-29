import * as Sequelize from "sequelize";
import { CONSTANTS } from "../../config/constants";
import db from "../../config/db.config";

const sObj = db.sObj;

const Currency = sObj.define(
    "currency",
    {
        short_name: {
            type: Sequelize.STRING(CONSTANTS.FIVE),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [CONSTANTS.ZERO, CONSTANTS.FIVE]
            }
        },
        long_name: {
            type: Sequelize.STRING(CONSTANTS.FIFTY),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [CONSTANTS.ZERO, CONSTANTS.FIFTY]
            }
        }
    },
    {
        underscored: true
    }
);

export default Currency;
