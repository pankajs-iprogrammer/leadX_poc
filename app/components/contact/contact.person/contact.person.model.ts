import * as Sequelize from "sequelize";
import db from "../../../config/db.config";
const sObj = db.sObj;
const ContactCompany = sObj.define("contact_person", {
    name: {
        type: Sequelize.STRING
    },
    company_id: {
        type: Sequelize.STRING
    },
    phone_number: {
        type: Sequelize.STRING,
        validate: {
            isNumeric: true
        }
    },
    email: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true,
            notEmpty: true
        }
    },
    address: {
        type: Sequelize.STRING
    },
    country_id: {
        type: Sequelize.INTEGER,
        foreignKey: true
    },
    state_id: {
        type: Sequelize.INTEGER,
        foreignKey: true
    },
    notes: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE,
        field: "created_date",
        defaultValue: Sequelize.now,
        validate: {
            isDate: true
        }
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: "updated_date"
    },
    is_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});
export default ContactCompany;
