import * as Joi from "@hapi/joi";
import * as redis from "redis";
import { CONSTANTS } from "../../../config/constants";
import db from "../../../config/db.config";
import BaseController from "../../../shared/controller/BaseController";
import ContactPerson from "./contact.person.model";
import DatabaseController from "../../../shared/controller/DatabaseController";

class ContactPersonController extends BaseController {
    public async addNewContactPerson(reqBody, res) {
        let self = this;
        ContactPerson.create(reqBody)
            .then(ContactPerson => {
                self.sendResponse(
                    res,
                    true,
                    CONSTANTS.SUCCESSCODE,
                    ContactPerson,
                    ""
                );
            })
            .catch(function(err) {
                self.sendResponse(
                    res,
                    true,
                    CONSTANTS.SERVERERRORCODE,
                    err,
                    ""
                );
            });
    }

    public async findByDateRange(reqBody, res: object) {
        /**************** Joi Validation Start ********************/
        const schema = Joi.object().keys({
            startDate: Joi.date()
                .iso()
                .required(),
            endDate: Joi.date()
                .iso()
                .min(Joi.ref("startDate"))
                .required()
        });
        Joi.validate(reqBody, schema, (err, value) => {
            if (err) {
                this.sendResponse(
                    res,
                    true,
                    CONSTANTS.SERVERERRORCODE,
                    err,
                    ""
                );
            } else {
                console.log("there is no error");
            }
        });
        /**************** Joi Validation End ********************/
        ContactPerson.findAll().then(ContactPersons => {
            // Send all ContactPersons to Client
            this.sendResponse(
                res,
                true,
                CONSTANTS.SUCCESSCODE,
                ContactPersons,
                ""
            );
        });
    }

    public async getAllContactPerson(reqBody, res: object) {
        const self = this;
        const client = redis.createClient();
        let ContactPersonData = [];
        /* Checking whether data exist in redis or not */
        client.get("ContactPersons", function(err, data) {
            if (data) {
                const ContactPersons = JSON.parse(data);
                ContactPersonData = [
                    {
                        msg: "Response is coming from Redis",
                        data: ContactPersons
                    }
                ];
                self.sendResponse(
                    res,
                    true,
                    CONSTANTS.SUCCESSCODE,
                    ContactPersonData,
                    ""
                );
            } else {
                ContactPerson.findAll({ where: { is_deleted: 0 } }).then(
                    ContactPersons => {
                        /* Storing response in Redis */
                        client.set(
                            "ContactPersons",
                            JSON.stringify(ContactPersons)
                        );
                        ContactPersonData = [
                            {
                                msg: "Response is coming from DB",
                                data: ContactPersons
                            }
                        ];
                        self.sendResponse(
                            res,
                            true,
                            CONSTANTS.SUCCESSCODE,
                            ContactPersonData,
                            ""
                        );
                    }
                );
            }
        });
    }

    public async findById(reqBody, res: object) {
        ContactPerson.findById(reqBody.ContactPersonId).then(ContactPerson => {
            this.sendResponse(
                res,
                true,
                CONSTANTS.SUCCESSCODE,
                ContactPerson,
                ""
            );
        });
    }

    public async update(reqBody, res: object) {
        const id = reqBody.id;
        ContactPerson.update(reqBody, { where: { id: reqBody.id } }).then(
            () => {
                this.sendResponse(
                    res,
                    true,
                    CONSTANTS.SUCCESSCODE,
                    "updated successfully a ContactPerson with id = " + id,
                    ""
                );
            }
        );
    }

    public async delete(reqBody, res: object) {
        const id = reqBody.id;
        // let deleteContactPerson = await this.deleteByCondition(
        //     ContactPerson,
        //     id
        // );
        // console.log(
        //     "+++++++deleteContactPerson.status+++++++++",
        //     deleteContactPerson.status
        // );
        // if (deleteContactPerson.status) {
        //     this.sendResponse(
        //         res,
        //         true,
        //         CONSTANTS.SUCCESSCODE,
        //         "Contact Person deleted successfully with id = " + id,
        //         ""
        //     );
        // } else {
        //     this.sendResponse(res, true, CONSTANTS.SERVERERRORCODE, "", "");
        // }

        ContactPerson.update({ is_deleted: 1 }, { where: { id: reqBody.id } })
            .then(() => {
                this.sendResponse(
                    res,
                    true,
                    CONSTANTS.SUCCESSCODE,
                    "deleted successfully a ContactPerson with id = " + id,
                    ""
                );
            })
            .catch(function(err) {
                this.sendResponse(
                    res,
                    true,
                    CONSTANTS.SERVERERRORCODE,
                    err,
                    ""
                );
            });
    }
}
export default ContactPersonController;
