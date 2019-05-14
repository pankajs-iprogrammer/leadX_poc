import * as Joi from '@hapi/joi';
import * as redis from 'redis';
import * as crypto from 'crypto';

import db from '../../config/db.config';
import BaseController from '../../shared/controller/BaseController';
import Customer from './customer.model';

class CustomerController extends BaseController {

  public async addNewCustomer(reqBody: any, res: object) {
    /**************** Joi Validation Start ********************/
    /*let schema = Joi.object().keys({
      password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/).min(8).required()
    });
    Joi.validate(reqBody, schema, (err, value) => {
      if (err) {
        this.sendResponse(res, true, 500, err, '');
        return false;
      } else {
        console.log("there is no error");
      }
    });*/
    /**************** Joi Validation End ********************/

    /****************** Password encryption start ******************/
    const plainTextPassword = reqBody.password;
    const passwordObj = await this.encryptPassword(plainTextPassword);

    reqBody.password = passwordObj.hash;
    reqBody.salt = passwordObj.salt;
    /****************** Password encryption end ********************/

    Customer.create(reqBody).then(customer => {
      this.sendResponse(res, true, 200, customer, '');
    }).catch(function (err) {
      this.sendResponse(res, true, 500, err, '');
    })
  }

  public async findByDateRange(reqBody: any, res: object) {
    /**************** Joi Validation Start ********************/
    const schema = Joi.object().keys({
      startDate: Joi.date().iso().required(),
      endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
    });
    Joi.validate(reqBody, schema, (err, value) => {
      if (err) {
        this.sendResponse(res, true, 500, err, '');
      } else {
        console.log("there is no error");
      }
    });
    /**************** Joi Validation End ********************/
    Customer.findAll().then(customers => {
      // Send all customers to Client
      this.sendResponse(res, true, 200, customers, '');
    });
  };

  public async getAllCustomer(reqBody: any, res: object) {
    const self = this;
    const client = redis.createClient();
    let customerData = [];
    /* Checking whether data exist in redis or not */
    client.get("customers", function (err, data) {
      if (data) {
        const customers = JSON.parse(data);
        customerData = [{ "msg": "Response is coming from Redis", "data": customers }];
        self.sendResponse(res, true, 200, customerData, '');
      }
      else {
        Customer.findAll().then(customers => {
          /* Storing response in Redis */
          client.set('customers', JSON.stringify(customers));
          customerData = [{ "msg": "Response is coming from DB", "data": customers }];
          self.sendResponse(res, true, 200, customerData, '');
        });
      }
    })
  };

  public async encryptPassword(plainTextPassword) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(plainTextPassword, salt, 1000, 64, `sha512`).toString(`hex`);
    const passObj = {
      salt,
      hash,
    };
    return passObj;
  }

  public async byProcedure(reqBody: any, res: object) {
    db.sObj.query("CALL GetAllUsers;").then(customers => {
      this.sendResponse(res, true, 200, customers, '');
    });
  };

  public async findById(reqBody: any, res: object) {
    Customer.findById(reqBody.customerId).then(customer => {
      this.sendResponse(res, true, 200, customer, '');
    })
  };

  public async update(reqBody: any, res: object) {
    const id = reqBody.customerId;

    Customer.update(reqBody,
      { where: { id: reqBody.customerId } },
    ).then(() => {
      this.sendResponse(res, true, 200, "updated successfully a customer with id = " + id, '');
    });
  };

  public async delete(reqBody: any, res: object) {
    const id = reqBody.customerId;
    Customer.destroy({
      where: { id: id },
    }).then(() => {
      this.sendResponse(res, true, 200, "deleted successfully a customer with id = " + id, '');
    });
  };
}

export default CustomerController;
