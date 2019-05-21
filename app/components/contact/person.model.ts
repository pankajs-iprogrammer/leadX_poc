import * as Sequelize from "sequelize";
import db from "../../config/db.config";
import { isNumber } from "util";
const sObj = db.sObj;
const ContactCompany = sObj.define(
    "contact_person",
    {
        account_id: {
            type: Sequelize.INTEGER(10),
            validate: {
                notEmpty: { msg: "account id is required" },
                isNumeric: true
            }
        },
        name: {
            type: Sequelize.STRING(100),
            validate: {
                notEmpty: { msg: "name is required" },
                isAlpha: true
            }
        },
        company_id: {
            type: Sequelize.STRING(10),
            validate: {
                notEmpty: { msg: "company id is required" }
            }
        },
        phone_number: {
            type: Sequelize.INTEGER(20),
            validate: {
                isNumeric: true,
                notEmpty: { msg: "phone number is required" }
            }
        },
        email: {
            type: Sequelize.STRING(100),
            validate: {
                isEmail: true,
                notEmpty: { msg: "email is required" }
            }
        },
        address_line_1: {
            type: Sequelize.STRING(255),
            validate: {
                notEmpty: { msg: "address is required" }
            }
        },
        address_line_2: {
            type: Sequelize.STRING(255),
            validate: {
                notEmpty: { msg: "address is required" }
            }
        },
        country_id: {
            type: Sequelize.INTEGER(10),
            foreignKey: true,
            validate: {
                notEmpty: { msg: "country id is required" },
                isNumber: true
            }
        },
        state_id: {
            type: Sequelize.INTEGER(10),
            foreignKey: true,
            validate: {
                notEmpty: { msg: "state id is required" },
                isNumber: true
            }
        },
        city_id: {
            type: Sequelize.INTEGER(10),
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
            type: Sequelize.INTEGER(10),
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
