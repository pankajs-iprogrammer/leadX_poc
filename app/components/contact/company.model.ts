import * as Sequelize from "sequelize";
import db from "../../config/db.config";
import { CONSTANTS } from "../../config/constants";
const sObj = db.sObj;
const ContactCompany = sObj.define(
    "contact_company",
    {
        account_id: {
            type: Sequelize.INTEGER(10),
            validate: {
                notEmpty: { msg: "account id is required" },
                isNumeric: true
            }
        },
        company_name: {
            type: Sequelize.STRING(100),
            validate: {
                notEmpty: { msg: "company name is required" }
            }
        },
        company_code: {
            type: Sequelize.STRING(20),
            unique: true,
            validate: {
                notEmpty: { msg: "company code is required" }
            }
        },
        office_address_line_1: {
            type: Sequelize.STRING(255),
            validate: {
                notEmpty: { msg: "office address is required" }
            }
        },
        office_address_line_2: {
            type: Sequelize.STRING(255),
            validate: {
                notEmpty: { msg: "office address is required" }
            }
        },
        postal_address: {
            type: Sequelize.STRING(10),
            validate: {
                notEmpty: { msg: "postal address is required" }
            }
        },
        country_id: {
            type: Sequelize.INTEGER(10),
            foreignKey: true,
            validate: {
                notEmpty: { msg: "country id is required" }
            }
        },
        state_id: {
            type: Sequelize.INTEGER(10),
            foreignKey: true,
            validate: {
                notEmpty: { msg: "state id is required" }
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
        website: {
            type: Sequelize.STRING(50),
            validate: {
                notEmpty: { msg: "website is required" },
                isUrl: true
            }
        },
        contact_person_name: {
            type: Sequelize.STRING(100),
            validate: {
                notEmpty: { msg: "contact person name is required" },
                isAlpha: true
            }
        },
        contact_person_phone: {
            type: Sequelize.INTEGER(20),
            validate: {
                notEmpty: { msg: "contact person phone is required" },
                isNumeric: true
            }
        },
        contact_person_email: {
            type: Sequelize.STRING(100),
            validate: {
                isEmail: true,
                notEmpty: { msg: "contact person phone is required" }
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
            "Contact company table has been successfully created, if one doesn't exist"
        )
    )
    .catch(error => console.log("This error occured", error));
export default ContactCompany;
