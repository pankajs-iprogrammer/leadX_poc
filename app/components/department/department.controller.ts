import Joi = require('@hapi/joi');
import redis = require('redis');
import crypto = require('crypto');
//import * as crypto from 'crypto';

import db from '../../config/db.config';
import BaseController from '../../shared/controller/BaseController';
import Department from './department.model';
import Customer from '../customer/customer.model'

// Customer.init({
  
// }, {
//   underscored: true,
//   "sequelize": Department.sequelize,
//   modelName: 'customer'
// });

class DepartmentController extends BaseController {

async getAllDepartment(reqBody, res, req) {
    const self = this;
    var client = redis.createClient();
    let DepartmentData = [];
    /* Checking whether data exist in redis or not */
    client.get("Departments", function (err, data) {
      if (data) {
        const Departments = JSON.parse(data);
        DepartmentData = [{ "msg": "Response is coming from Redis", "data": Departments }];
        self.sendResponse(res, true, 200, DepartmentData, '');
      }
      else {
        Department.findAll({
          include : [{
                      model : Customer
                    }]
        }).then(Departments => {
          /* Storing response in Redis */
          client.set('Departments', JSON.stringify(Departments));
          DepartmentData = [{ "msg": "Response is coming from DB", "data": Departments }];
          self.sendResponse(res, true, 200, DepartmentData, '');
        });
      }
    })
  };
}

export default DepartmentController;
