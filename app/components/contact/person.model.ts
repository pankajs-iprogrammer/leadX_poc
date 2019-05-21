import * as Sequelize from "sequelize";
import db from "../../config/db.config";
const sObj = db.sObj;
const ContactCompany = sObj.define(
    "contact_person",
    {
        name: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: { msg: "name is required" }
            }
        },
        company_id: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: { msg: "company id is required" }
            }
        },
        phone_number: {
            type: Sequelize.STRING,
            validate: {
                isNumeric: true,
                notEmpty: { msg: "phone number is required" }
            }
        },
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true,
                notEmpty: { msg: "email is required" }
            }
        },
        address: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: { msg: "address is required" }
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
        notes: {
            type: Sequelize.STRING
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
            "Contact person table has been successfully created, if one doesn't exist"
        )
    )
    .catch(error => console.log("This error occured", error));
export default ContactCompany;
