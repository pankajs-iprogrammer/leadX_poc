import * as Sequelize from "sequelize";
import { CONSTANTS } from "../../config/constants";
import db from "../../config/db.config";

const sObj = db.sObj;

const LeadStatus = sObj.define(
    "lead_status",
    {
        name: {
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

export default LeadStatus;
