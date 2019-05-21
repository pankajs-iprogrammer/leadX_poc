import * as Sequelize from "sequelize";
import db from "../../../config/db.config";
const sObj = db.sObj;
const ContactCompany = sObj.define(
    "contact_company",
    {
        company_name: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: { msg: "company name is required" }
            }
        },
        company_code: {
            type: Sequelize.STRING,
            unique: true,
            validate: {
                notEmpty: { msg: "company code is required" }
            }
        },
        office_address: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: { msg: "office address is required" }
            }
        },
        postal_address: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: { msg: "postal address is required" }
            }
        },
        country_id: {
            type: Sequelize.INTEGER,
            foreignKey: true,
            validate: {
                notEmpty: { msg: "country id is required" }
            }
        },
        state_id: {
            type: Sequelize.INTEGER,
            foreignKey: true,
            validate: {
                notEmpty: { msg: "state id is required" }
            }
        },
        website: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: { msg: "website is required" }
            }
        },
        contact_person_name: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: { msg: "contact person name is required" }
            }
        },
        contact_person_phone: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: { msg: "contact person phone is required" },
                isNumeric: true
            }
        },
        contact_person_email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true,
                notEmpty: { msg: "contact person phone is required" }
            }
        },
        notes: {
            type: Sequelize.TEXT
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
