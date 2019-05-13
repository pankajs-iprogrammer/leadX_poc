const Joi = require('@hapi/joi');
const redis = require('redis');
const crypto = require('crypto');
import db from '../config/db.config';
import Customer from '../model/customer.model';
class CustomerController {
  addNewCustomer(req, res) {
    /****************** Password encryption start ******************/
    let plainTextPassword = req.body.password;
    let salt = crypto.randomBytes(16).toString('hex');
    let hash = crypto.pbkdf2Sync(plainTextPassword, salt, 1000, 64, `sha512`).toString(`hex`);
    req.body.password = hash;
    req.body.salt = salt;
    /****************** Password encryption end ********************/
    Customer.create(req.body).then(customer => {
      res.send(customer);
    }).catch(function (err) {
      return res.status(500).send(err);
    })    
  }

  findByDateRange(req, res) {
    /**************** Joi Validation Start ********************/
    let schema = Joi.object().keys({
      startDate: Joi.date().iso().required(),
      endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
    });
    Joi.validate(req.body, schema, (err, value) => {
      if (err) {
        console.log("please use valid parameters");
        res.send(err);
      }
      else {
        console.log("there is no error");
      }
    });
    /**************** Joi Validation End ********************/
    Customer.findAll().then(customers => {
      // Send all customers to Client
      res.send(customers);
    });
  };

  findAll(req, res) {
    var client = redis.createClient();
    /* Checking whether data exist in redis or not */
    client.get("customers", function (err, data) {
      if (data) {
        let customers = JSON.parse(data);
        res.send([{ "msg": "Response is coming from Redis", "data": customers }]);
      }
      else {
        Customer.findAll().then(customers => {
          /* Storing response in Redis */
          client.set('customers', JSON.stringify(customers));
          res.send([{ "msg": "Response is coming from DB", "data": customers }]);
        });
      }
    })
  };

  encryptPassword(plainTextPassword) {
    var cipher = crypto.createCipher('aes192', '7u8i9o0p');
    var encryptedPassword = cipher.update(plainTextPassword, 'utf8', 'hex');
    return encryptedPassword;
  }

  byProcedure(req, res) {
    db.sObj.query("CALL GetAllUsers;").then(customers => {
      res.send(customers);
    });
  };

  findById(req, res) {
    Customer.findById(req.params.customerId).then(customer => {
      res.send(customer);
    })
  };

  update(req, res) {
    const id = req.params.customerId;
    Customer.update({ firstname: req.body.firstname, lastname: req.body.lastname, age: req.body.age },
      { where: { id: req.params.customerId } }
    ).then(() => {
      res.status(200).send("updated successfully a customer with id = " + id);
    });
  };

  delete(req, res) {
    const id = req.params.customerId;
    Customer.destroy({
      where: { id: id }
    }).then(() => {
      res.status(200).send('deleted successfully a customer with id = ' + id);
    });
  };
}

export default CustomerController;