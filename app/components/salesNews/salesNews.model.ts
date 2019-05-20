import * as Sequelize from 'sequelize';
import { CONSTANTS } from '../../config/constants';
import db from "../../config/db.config";
const sObj = db.sObj;
const SalesNews = sObj.define('sales_news', {
  title: {
    type: Sequelize.STRING,
    allowNull: false, 
    validate: {
      notEmpty: true,
      len: [CONSTANTS.ZERO, CONSTANTS.HUNDRED],
    },
  },
  cover_image: {
    type: Sequelize.STRING,
    //allowNull: false, 
    /*validate: {
      notEmpty: true,
      len: [0, 100],
    },*/
  },
  news_body : {
    type: Sequelize.TEXT,
    allowNull: false, 
    validate: {
      notEmpty: true,
    },
  },
  user_id : {
    type: Sequelize.INTEGER,
    allowNull: false, 
    validate: {
      notEmpty: true,
    },
  },
  is_active : {
    type : Sequelize.BOOLEAN,
    allowNull: false, 
    defaultValue: true,
  },
  is_deleted : {
    type : Sequelize.BOOLEAN,
    allowNull: false, 
    defaultValue: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Date.now(),
    field: 'created_date',
  },
  updatedAt : 
  {
    type: Sequelize.DATE,
    allowNull: true, 
    field: 'updated_date',
   },
});
export default SalesNews;
