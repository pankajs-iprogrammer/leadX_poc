const Sequelize = require('sequelize');
import db from "../../config/db.config";
let sObj = db.sObj;
const Customer = sObj.define('customer', {
  firstname: {
    type: Sequelize.STRING,
    is: /^[a-z]+$/i,  // or isAlpha: true
    notEmpty: true,
  },
  lastname: {
    type: Sequelize.STRING,
    validate: {
      is: /^[a-z]+$/i,  // or isAlpha: true
      notEmpty: true,
    }
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true,
      notEmpty: true,
    }
  },
  password: {
    type: Sequelize.STRING
  },
  salt: {
    type: Sequelize.STRING
  },
  contact: {
    type: Sequelize.STRING,
    validate: {
      isNumeric: true
    }
  }
});

export default Customer;