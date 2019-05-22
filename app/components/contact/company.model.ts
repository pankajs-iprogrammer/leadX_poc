import * as Sequelize from "sequelize";
import db from "../../config/db.config";
import { CONSTANTS } from "../../config/constants";
const sObj = db.sObj;
const ContactCompany = sObj.define(
    "contact_company",
    {
        account_id: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            validate: {
                notEmpty: { msg: "account id is required" },
                isNumeric: true,
                len: [CONSTANTS.ONE, CONSTANTS.TEN]
            }
        },
        company_name: {
            type: Sequelize.STRING(CONSTANTS.HUNDRED),
            validate: {
                notEmpty: { msg: "company name is required" },
                len: [CONSTANTS.ONE, CONSTANTS.HUNDRED]
            }
        },
        company_code: {
            type: Sequelize.STRING(CONSTANTS.TWENTY),
            unique: true,
            validate: {
                notEmpty: { msg: "company code is required" },
                len: [CONSTANTS.ONE, CONSTANTS.TWENTY]
            }
        },
        office_address_line_1: {
            type: Sequelize.STRING(CONSTANTS.TWOHUNDREDFIFTYFIVE),
            validate: {
                notEmpty: { msg: "office address is required" },
                len: [CONSTANTS.ONE, CONSTANTS.TWOHUNDREDFIFTYFIVE]
            }
        },
        office_address_line_2: {
            type: Sequelize.STRING(CONSTANTS.TWOHUNDREDFIFTYFIVE),
            validate: {
                notEmpty: { msg: "office address is required" },
                len: [CONSTANTS.ONE, CONSTANTS.TWOHUNDREDFIFTYFIVE]
            }
        },
        postal_address: {
            type: Sequelize.STRING(CONSTANTS.TEN),
            validate: {
                notEmpty: { msg: "postal address is required" },
                len: [CONSTANTS.ONE, CONSTANTS.TEN]
            }
        },
        country_id: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            foreignKey: true,
            validate: {
                notEmpty: { msg: "country id is required" },
                len: [CONSTANTS.ONE, CONSTANTS.TEN]
            }
        },
        state_id: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            foreignKey: true,
            validate: {
                notEmpty: { msg: "state id is required" },
                len: [CONSTANTS.ONE, CONSTANTS.TEN]
            }
        },
        city_id: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            foreignKey: true,
            validate: {
                notEmpty: { msg: "city id is required" },
                isNumber: true,
                len: [CONSTANTS.ONE, CONSTANTS.TEN]
            }
        },
        website: {
            type: Sequelize.STRING(CONSTANTS.FIFTY),
            validate: {
                notEmpty: { msg: "website is required" },
                isUrl: true,
                len: [CONSTANTS.ONE, CONSTANTS.FIFTY]
            }
        },
        contact_person_name: {
            type: Sequelize.STRING(CONSTANTS.HUNDRED),
            validate: {
                notEmpty: { msg: "contact person name is required" },
                isAlpha: true,
                len: [CONSTANTS.ONE, CONSTANTS.HUNDRED]
            }
        },
        contact_person_phone: {
            type: Sequelize.INTEGER(CONSTANTS.TWENTY),
            validate: {
                notEmpty: { msg: "contact person phone is required" },
                isNumeric: true,
                len: [CONSTANTS.ONE, CONSTANTS.TWENTY]
            }
        },
        contact_person_email: {
            type: Sequelize.STRING(CONSTANTS.HUNDRED),
            validate: {
                isEmail: true,
                notEmpty: { msg: "contact person email is required" },
                len: [CONSTANTS.ONE, CONSTANTS.HUNDRED]
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
            allowNull: false,
            len: [CONSTANTS.ONE, CONSTANTS.TEN]
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
