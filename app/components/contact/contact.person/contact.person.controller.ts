import * as Joi from "@hapi/joi";
import * as redis from "redis";
import { CONSTANTS } from "../../../config/constants";
import BaseController from "../../../shared/controller/BaseController";
import ContactPersonModel from "./contact.person.model";

class ContactPersonController extends BaseController {
    public async addNewContactPerson(reqBody, res) {
        const self = this;
        const contact_person = await self.createData(
            ContactPersonModel,
            reqBody
        );
        self.sendResponse(
            res,
            true,
            CONSTANTS.SUCCESSCODE,
            contact_person.data,
            ""
        );
    }
    public async getAllContactPerson(reqBody, res: object) {
        const self = this;
        const contact_person = await self.getProcessedData(
            ContactPersonModel,
            reqBody
        );
        self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, contact_person, "");
    }

    public async getContactPersonOne(reqBody, res: object) {
        const self = this;
        const arrayFilters = {};
        const arrFilterEq = reqBody["arrayFilters"];
        if (
            reqBody.hasOwnProperty("arrayFilters") &&
            Array.isArray(reqBody["arrayFilters"])
        ) {
            arrFilterEq.forEach(function(item, index) {
                Object.assign(arrayFilters, item);
            });
        }
        const condition = {
            where: arrayFilters
        };
        const contact_person = await self.getOne(ContactPersonModel, condition);
        if (self.check(["data", "id"], contact_person) != null) {
            self.sendResponse(
                res,
                true,
                CONSTANTS.SUCCESSCODE,
                contact_person.data,
                ""
            );
        } else {
            self.sendResponse(
                res,
                true,
                CONSTANTS.SERVERERRORCODE,
                contact_person.data,
                ""
            );
        }
    }

    public async update(reqBody, res: object) {
        const self = this;
        const condition = {
            where: {
                id: reqBody.id
            }
        };
        const contact_person = await self.updateData(
            ContactPersonModel,
            reqBody,
            condition
        );
        self.sendResponse(
            res,
            true,
            CONSTANTS.SUCCESSCODE,
            contact_person.msg,
            ""
        );
    }

    public async delete(reqBody, res: object) {
        const self = this;
        reqBody.is_deleted = 1;
        const condition = {
            where: {
                id: reqBody.id
            }
        };
        const contact_person = await self.updateData(
            ContactPersonModel,
            reqBody,
            condition
        );
        self.sendResponse(
            res,
            true,
            CONSTANTS.SUCCESSCODE,
            contact_person.msg,
            ""
        );
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
        ContactPersonModel.findAll().then(ContactPersons => {
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
}
export default ContactPersonController;
