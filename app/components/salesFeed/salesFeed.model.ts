import * as Sequelize from "sequelize";
import db from "../../config/db.config";
import { CONSTANTS } from "../../config/constants";
import User from "../user/user.model";
import Company from "../contact/company.model";
const sObj = db.sObj;
const SalesFeed = sObj.define(
    "sales_feed",
    {
        account_id: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            foreignKey: true,
            validate: {
                notEmpty: { msg: "account id is required" },
                isNumeric: true,
                len: [CONSTANTS.ONE, CONSTANTS.TEN]
            }
        },
        user_id: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            foreignKey: true,
            validate: {
                notEmpty: { msg: "user id is required" },
                isNumeric: true,
                len: [CONSTANTS.ONE, CONSTANTS.TEN]
            }
        },
        lead_id: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            foreignKey: true,
            validate: {
                notEmpty: { msg: "lead id is required" },
                isNumeric: true,
                len: [CONSTANTS.ONE, CONSTANTS.TEN]
            }
        },
        action_type: {
            type: Sequelize.STRING(CONSTANTS.TEN),
            validate: {
                notEmpty: { msg: "action type is required" },
                len: [CONSTANTS.ONE, CONSTANTS.TEN]
            }
        },
        is_deleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        created_by: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            foreignKey: true
        },
        company_id: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            foreignKey: true
        }
    },
    {
        underscored: true
    }
);
SalesFeed.belongsTo(User, {
    as: "UserRef",
    foreignKey: "created_by"
});
SalesFeed.belongsTo(Company, {
    as: "CompanyRef",
    foreignKey: "company_id"
});
sObj.sync()
    .then(() =>
        console.log(
            "salesFeed table has been successfully created, if one doesn't exist"
        )
    )
    .catch(error => console.log("This error occured", error));
export default SalesFeed;
