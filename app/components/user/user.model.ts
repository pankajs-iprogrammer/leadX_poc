import * as Sequelize from "sequelize";
import db from "../../config/db.config";
import * as crypto from "crypto";
import { CONSTANTS } from "../../config/constants";

const sObj = db.sObj;
const User = sObj.define("user", {
    account_id: {
        type: Sequelize.INTEGER,
        foreignKey: true
    },
    name: {
        type: Sequelize.STRING,
        validate: {
            is: CONSTANTS.alphaBetVal, // or isAlpha: true
            notEmpty: true
        }
    },
    user_avatar: {
        type: Sequelize.STRING,
        validate: {
            is: CONSTANTS.alphaBetVal, // or isAlpha: true
            notEmpty: true
        }
    },
    email: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true,
            notEmpty: true
        }
    },
    password: {
        type: Sequelize.STRING
    },
    salt: {
        type: Sequelize.STRING
    },
    is_active: {
        type: Sequelize.BOOLEAN
    },
    contact: {
        type: Sequelize.STRING,
        validate: {
            isNumeric: true
        }
    },
    user_role_id: {
        type: Sequelize.INTEGER,
        foreignKey: true
    },
    discipline_id: {
        type: Sequelize.INTEGER,
        foreignKey: true
    },
    is_deleted: {
        type: Sequelize.BOOLEAN
    },
    createdAt: {
        type: Sequelize.DATE,
        field: "created_date"
    },
    updatedAt: {
        type: Sequelize.DATE,
        field: "updated_date"
    }
});

User.hook("beforeCreate", function(user) {
    const pass = user.password;
    const iterations = CONSTANTS.THOUSAND;
    const keylen = CONSTANTS.SIXTYFOUR;
    User.salt = crypto.randomBytes(CONSTANTS.SIXTEEN).toString("hex");
    User.password = crypto
        .pbkdf2Sync(pass, User.salt, iterations, keylen, `sha512`)
        .toString(`hex`);
});

User.prototype.verifyPassword = function(password) {
    const pass = password;
    const iterations = CONSTANTS.THOUSAND;
    const keylen = CONSTANTS.SIXTYFOUR;
    const hash = crypto
        .pbkdf2Sync(pass, this.salt, iterations, keylen, `sha512`)
        .toString(`hex`);
    return hash === this.password;
};

//User.belongsTo(Department , {as : 'DepartmentRef' , foreignKey : 'department_id'});
export default User;
