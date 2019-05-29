import * as Sequelize from "sequelize";
import { CONSTANTS } from "../../config/constants";
import db from "../../config/db.config";

const sObj = db.sObj;

const LeadSource = sObj.define(
    "lead_source",
    {
        name: {
            type: Sequelize.STRING(CONSTANTS.HUNDRED),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [CONSTANTS.ZERO, CONSTANTS.HUNDRED]
            }
        }
    },
    {
        underscored: true
    }
);

export default LeadSource;
