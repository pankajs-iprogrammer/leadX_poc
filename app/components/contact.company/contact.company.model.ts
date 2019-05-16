import * as Sequelize from 'sequelize';
import db from "../../config/db.config";
const sObj = db.sObj;
const ContactCompany = sObj.define('contact_company', {
    company_name: {
    type: Sequelize.STRING,
  },
  company_code: {
    type: Sequelize.STRING,
  },
  office_address : {
    type: Sequelize.STRING,
  },
  postal_address : {
    type: Sequelize.STRING,
  },
  country_id : {
    type : Sequelize.INTEGER,
    foreignKey : true,
  },
  state_id :
  {
    type : Sequelize.INTEGER,
    foreignKey : true,
  },
  website :{
    type: Sequelize.STRING,
  },
  contact_person_name :{
    type: Sequelize.STRING,
  },
  contact_person_phone :{
    type: Sequelize.STRING,
    validate: {
      isNumeric: true,
    },
  },
  contact_person_email : {
    type: Sequelize.STRING,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  },
  notes : {
    type: Sequelize.STRING,
  },
  createdAt: {
    type: Sequelize.DATE,
    field: 'created_date',
  },
  updatedAt : 
  {
    type: Sequelize.DATE,
    field: 'updated_date',
   },
  //   updatedAt: false,
  // timestamps: true
 

});
export default ContactCompany;
