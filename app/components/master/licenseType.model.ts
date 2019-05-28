import * as Sequelize from "sequelize";
import { CONSTANTS } from "../../config/constants";
import db from "../../config/db.config";

const sObj = db.sObj;

const LicenseType = sObj.define(
    "license_type",
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
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        created_by: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            foreignKey: true
        }
    },
    {
        underscored: true
    }
);
sObj.sync()
    .then(() =>
        console.log(
            "license_type table has been successfully created, if one doesn't exist"
        )
    )
    .catch(error => console.log("This error occured", error));
export default LicenseType;
