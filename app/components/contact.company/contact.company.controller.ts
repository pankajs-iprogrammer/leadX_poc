import * as Joi from '@hapi/joi';
import * as redis from 'redis';
import { CONSTANTS } from '../../config/constants';
import db from '../../config/db.config';
import BaseController from '../../shared/controller/BaseController';
import ContactCompany from './contact.company.model';

class ContactCompanyController extends BaseController {
  public async addNewContactCompany(reqBody, res) {
    let self = this;
    ContactCompany.create(reqBody).then(ContactCompany => {
      self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, ContactCompany, '');
    }).catch(function (err) {
      self.sendResponse(res, true, CONSTANTS.SERVERERRORCODE, err, '');
    })
  }

  public async findByDateRange(reqBody, res: object) {
    /**************** Joi Validation Start ********************/
    const schema = Joi.object().keys({
      startDate: Joi.date().iso().required(),
      endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
    });
    Joi.validate(reqBody, schema, (err, value) => {
      if (err) {
        this.sendResponse(res, true, CONSTANTS.SERVERERRORCODE, err, '');
      } else {
        console.log("there is no error");
      }
    });
    /**************** Joi Validation End ********************/
    ContactCompany.findAll().then(ContactCompanys => {
      // Send all ContactCompanys to Client
      this.sendResponse(res, true, CONSTANTS.SUCCESSCODE, ContactCompanys, '');
    });
  };

  public async getAllContactCompany(reqBody, res: object) {
    const self = this;
    const client = redis.createClient();
    let ContactCompanyData = [];
    /* Checking whether data exist in redis or not */
    client.get("ContactCompanys", function (err, data) {
      if (data) {
        const ContactCompanys = JSON.parse(data);
        ContactCompanyData = [{ "msg": "Response is coming from Redis", "data": ContactCompanys }];
        self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, ContactCompanyData, '');
      }
      else {

        ContactCompany.findAll({
        }).then(ContactCompanys => {
          /* Storing response in Redis */
          client.set('ContactCompanys', JSON.stringify(ContactCompanys));
          ContactCompanyData = [{ "msg": "Response is coming from DB", "data": ContactCompanys }];
          self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, ContactCompanyData, '');
        });
      }
    })
  };

  public async findById(reqBody, res: object) {
    ContactCompany.findById(reqBody.ContactCompanyId).then(ContactCompany => {
      this.sendResponse(res, true, CONSTANTS.SUCCESSCODE, ContactCompany, '');
    })
  };

  public async update(reqBody, res: object) {
    const id = reqBody.id;
    ContactCompany.update(reqBody,
      { where: { id: reqBody.id } },
    ).then(() => {
      this.sendResponse(res, true, CONSTANTS.SUCCESSCODE, "updated successfully a ContactCompany with id = " + id, '');
    });
  };

  public async delete(reqBody, res: object) {
    const id = ContactCompany.id;
    ContactCompany.delete({
      where: { id: id },
    }).then(() => {
      this.sendResponse(res, true, CONSTANTS.SUCCESSCODE, "deleted successfully a ContactCompany with id = " + id, '');
    });
  };
}
export default ContactCompanyController;
