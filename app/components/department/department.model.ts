import * as Sequelize from 'sequelize';
import Customer from '../customer/customer.model';
import db from "../../config/db.config";
const sObj = db.sObj;
const Department = sObj.define('department', {
  id: {
    primaryKey: true,
    foreignKey: true,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING,
    is: /^[a-z]+$/i,  // or isAlpha: true
    notEmpty: true,
  },
  description: {
    type: Sequelize.STRING,
    validate: {
      is: /^[a-z]+$/i,  // or isAlpha: true
    }
  }
});
Department.hasMany(Customer);
export default Department;
