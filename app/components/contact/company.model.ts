import * as Sequelize from "sequelize";
import db from "../../config/db.config";
import { CONSTANTS } from "../../config/constants";
import User from "../user/user.model";
import Territory from "../master/territory.model";
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
                len: [CONSTANTS.ONE, CONSTANTS.TEN],
                isNumeric: true
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
                isNumeric: true,
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
                len: [CONSTANTS.ONE, CONSTANTS.HUNDRED]
            }
        },
        contact_person_phone: {
            type: Sequelize.STRING(CONSTANTS.TWENTY),
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
        created_by: {
            type: Sequelize.INTEGER(CONSTANTS.TEN),
            foreignKey: true
        }
    },
    {
        underscored: true
    }
);
ContactCompany.belongsTo(User, {
    foreignKey: "created_by"
});
ContactCompany.belongsTo(Territory.Country, {
    foreignKey: ["country_id"]
});
ContactCompany.belongsTo(Territory.State, {
    foreignKey: ["state_id"]
});
ContactCompany.belongsTo(Territory.City, {
    foreignKey: ["city_id"]
});
/*sObj.sync()
    .then(() =>
        console.log(
            "Contact company table has been successfully created, if one doesn't exist"
        )
    )
    .catch(error => console.log("This error occured", error));*/
export default ContactCompany;
