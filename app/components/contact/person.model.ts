import * as Sequelize from "sequelize";
import db from "../../config/db.config";
import { isNumber } from "util";
import { CONSTANTS } from "../../config/constants";
const sObj = db.sObj;
const ContactCompany = sObj.define(
    "contact_person",
    {
        account_id: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            validate: {
                notEmpty: { msg: "account id is required" },
                isNumeric: true
            }
        },
        name: {
            type: Sequelize.STRING(CONSTANTS.HUNDRED),
            validate: {
                notEmpty: { msg: "name is required" },
                isAlpha: true
            }
        },
        company_id: {
            type: Sequelize.STRING(CONSTANTS.TEN),
            validate: {
                notEmpty: { msg: "company id is required" }
            }
        },
        phone_number: {
            type: Sequelize.INTEGER(CONSTANTS.TWENTY),
            validate: {
                isNumeric: true,
                notEmpty: { msg: "phone number is required" }
            }
        },
        email: {
            type: Sequelize.STRING(CONSTANTS.HUNDRED),
            validate: {
                isEmail: true,
                notEmpty: { msg: "email is required" }
            }
        },
        address_line_1: {
            type: Sequelize.STRING(CONSTANTS.TWOHUNDREDFIFTYFIVE),
            validate: {
                notEmpty: { msg: "address is required" }
            }
        },
        address_line_2: {
            type: Sequelize.STRING(CONSTANTS.TWOHUNDREDFIFTYFIVE),
            validate: {
                notEmpty: { msg: "address is required" }
            }
        },
        country_id: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            foreignKey: true,
            validate: {
                notEmpty: { msg: "country id is required" },
                isNumber: true
            }
        },
        state_id: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            foreignKey: true,
            validate: {
                notEmpty: { msg: "state id is required" },
                isNumber: true
            }
        },
        city_id: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            foreignKey: true,
            validate: {
                notEmpty: { msg: "city id is required" },
                isNumber: true
            }
        },
        notes: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        is_deleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal("NOW()")
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        created_by: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            allowNull: false
        }
    },
    {
        underscored: true
    }
);

sObj.sync()
    .then(() =>
        console.log(
            "Contact person table has been successfully created, if one doesn't exist"
        )
    )
    .catch(error => console.log("This error occured", error));
export default ContactCompany;
