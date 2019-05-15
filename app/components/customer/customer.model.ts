//import Sequelize = require('sequelize');
import * as Sequelize from 'sequelize';
import db from "../../config/db.config";
import Department from '../department/department.model'
const sObj = db.sObj;
const Customer = sObj.define('customer', {
  firstname: {
    type: Sequelize.STRING,
    validate: {
      is: /^[a-z]+$/i,  // or isAlpha: true
      notEmpty: true,
    },
  },
  lastname: {
    type: Sequelize.STRING,
    validate: {
      is: /^[a-z]+$/i,  // or isAlpha: true
      notEmpty: true,
    },
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  },
  password: {
    type: Sequelize.STRING,
  },
  salt: {
    type: Sequelize.STRING,
  },
  contact: {
    type: Sequelize.STRING,
    validate: {
      isNumeric: true,
    },
   },
  // department_id : {
  //   type : Sequelize.INTEGER,
  //  // foreignKey : true,
  // },
});
//Customer.belongsTo(Department , {as : 'DepartmentRef' , foreignKey : 'department_id'});
export default Customer;
