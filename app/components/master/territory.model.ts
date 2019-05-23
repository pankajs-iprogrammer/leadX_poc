import * as Sequelize from "sequelize";
import { CONSTANTS } from "../../config/constants";
import db from "../../config/db.config";
const sObj = db.sObj;

const Country = sObj.define(
    "country",
    {
        name: {
            type: Sequelize.STRING(CONSTANTS.FIFTY),
            unique: true,
            validate: {
                notEmpty: { msg: "country name is required" },
                len: [CONSTANTS.ONE, CONSTANTS.FIFTY]
            }
        },
        iso_code: {
            type: Sequelize.STRING(CONSTANTS.FIVE),
            unique: true,
            validate: {
                notEmpty: { msg: "ISO CODE is required" },
                len: [CONSTANTS.ONE, CONSTANTS.FIVE]
            }
        }
    },
    {
        underscored: true
    }
);

const State = sObj.define(
    "state",
    {
        name: {
            type: Sequelize.STRING(CONSTANTS.FIFTY),
            unique: true,
            validate: {
                notEmpty: { msg: "state name is required" },
                len: [CONSTANTS.ONE, CONSTANTS.FIFTY]
            }
        },
        state_code: {
            type: Sequelize.STRING(CONSTANTS.THREE),
            unique: true,
            validate: {
                notEmpty: { msg: "state code is required" },
                len: [CONSTANTS.ONE, CONSTANTS.THREE]
            }
        },
        country_id: {
            type: Sequelize.STRING(CONSTANTS.TEN),
            foreignKey: true,
            validate: {
                notEmpty: { msg: "country id is required" },
                len: [CONSTANTS.ONE, CONSTANTS.TEN],
                isNumeric: true
            }
        }
    },
    {
        underscored: true
    }
);

const City = sObj.define(
    "city",
    {
        name: {
            type: Sequelize.STRING(CONSTANTS.FIFTY),
            unique: true,
            validate: {
                notEmpty: { msg: "city name is required" },
                len: [CONSTANTS.ONE, CONSTANTS.FIFTY]
            }
        },
        state_id: {
            type: Sequelize.STRING(CONSTANTS.TEN),
            foreignKey: true,
            validate: {
                notEmpty: { msg: "state id is required" },
                len: [CONSTANTS.ONE, CONSTANTS.TEN],
                isNumeric: true
            }
        },
        country_id: {
            type: Sequelize.STRING(CONSTANTS.TEN),
            foreignKey: true,
            validate: {
                notEmpty: { msg: "country id is required" },
                len: [CONSTANTS.ONE, CONSTANTS.TEN],
                isNumeric: true
            }
        }
    },
    {
        underscored: true
    }
);
// ContactCompany.belongsTo(User, {
//     as: "UserRef",
//     foreignKey: "created_by"
// });
// sObj.sync()
//     .then(() =>
//         console.log(
//             "country, state, city table have been successfully created, if one doesn't exist"
//         )
//     )
//     .catch(error => console.log("This error occured", error));
export default { Country, State, City };
