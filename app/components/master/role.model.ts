import * as Sequelize from "sequelize";
import { CONSTANTS } from "../../config/constants";
import db from "../../config/db.config";

const sObj = db.sObj;

const Role = sObj.define(
    "role",
    {
        actual_name: {
            type: Sequelize.STRING(CONSTANTS.HUNDRED),
            validate: {
                notEmpty: true,
                len: [CONSTANTS.ONE, CONSTANTS.HUNDRED]
            }
        },
        display_name: {
            type: Sequelize.STRING(CONSTANTS.HUNDRED),
            validate: {
                notEmpty: true,
                len: [CONSTANTS.ONE, CONSTANTS.HUNDRED]
            }
        }
    },
    {
        underscored: true
    }
);
sObj.sync()
    .then(() =>
        console.log(
            "role table has been successfully created, if one doesn't exist"
        )
    )
    .catch(error => console.log("This error occured", error));
export default Role;
