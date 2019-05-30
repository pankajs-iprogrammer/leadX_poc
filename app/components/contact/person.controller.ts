import { CONSTANTS } from "../../config/constants";
import BaseController from "../../shared/controller/BaseController";
import ContactPersonModel from "./person.model";
import User from "../user/user.model";
import Territory from "../master/territory.model";
import companyController from "../contact/company.controller";
import * as redis from "redis";
const companyObj = new companyController();
const client = redis.createClient();
class ContactPersonController extends BaseController {
    public async addNewContactPerson(reqBody, res, req) {
        const self = this;
        reqBody.created_by = req.session.user_id;
        reqBody.account_id = req.session.account_id;
        const contact_person = await self.createData(
            ContactPersonModel,
            reqBody
        );
        if (!contact_person.status) {
            self.sendResponse(
                res,
                false,
                CONSTANTS.SERVERERRORCODE,
                contact_person.data.errors[0].message,
                contact_person.msg
            );
        } else {
            this.clearRedisCacheByModule("PERSON");
            self.sendResponse(
                res,
                true,
                CONSTANTS.SUCCESSCODE,
                contact_person,
                ""
            );
        }
    }

    public async getAllContactPerson(reqBody, res: object, is_return = 0) {
        const includeObj = [
            {
                model: User,
                as: "UserRef",
                attributes: ["name", "user_avatar"]
            },
            {
                model: Territory.Country,
                attributes: ["name", "iso_code"]
            },
            {
                model: Territory.State,
                attributes: ["name", "state_code"]
            },
            {
                model: Territory.City,
                attributes: ["name"]
            }
        ];
        const self = this;
        const jsonReqBody = self.reqbodyStringify(reqBody);
        const hashcode = "PERSON_" + self.hashCode(jsonReqBody);
        var contactPersonData = [];
        const contact_person = await self.getProcessedData(
            ContactPersonModel,
            reqBody,
            includeObj
        );
        client.get(hashcode, function(err, data) {
            if (data) {
                const contactPerson = JSON.parse(data);
                contactPersonData = [
                    {
                        msg: "Response is coming from Redis",
                        data: contactPerson
                    }
                ];
                self.sendResponse(
                    res,
                    true,
                    CONSTANTS.SUCCESSCODE,
                    contactPersonData,
                    ""
                );
            } else {
                client.set(hashcode, JSON.stringify(contact_person));
                contactPersonData = [
                    { msg: "Response is coming from DB", data: contact_person }
                ];
                self.sendResponse(
                    res,
                    true,
                    CONSTANTS.SUCCESSCODE,
                    contactPersonData,
                    ""
                );
            }
        });

        if (is_return === 1) {
            return contact_person;
        }
    }

    public async getPersonListInMobileContactStyle(reqBody, res: object) {
        let contact_person = await this.getAllContactPerson(reqBody, res, 1);
        if (this.check(["sort", "field"], reqBody) == "name") {
            reqBody["sort"]["field"] = "company_name";
        }
        /* Checking here if request body has selectFilters &
         * if yes then if it has name property then changing it to company_name
         */
        let nameIndex = -1;
        if (this.check(["selectFilters", 0], reqBody)) {
            nameIndex = reqBody["selectFilters"].indexOf("name");
        }
        if (nameIndex != -1) {
            reqBody["selectFilters"][nameIndex] = "company_name";
        }

        let company_contact = await companyObj.getAllContactCompany(
            reqBody,
            res,
            1
        );
        // this.sendResponse(
        //     res,
        //     true,
        //     CONSTANTS.SUCCESSCODE,
        //     company_contact,
        //     ""
        // );
        // return false;
        const self = this;
        let mapped_data = [];
        if (
            Array.isArray(contact_person["rows"]) &&
            contact_person["count"] > 0
        ) {
            let self = this;
            let list = self.convertToObject(contact_person["rows"]);
            if (
                Array.isArray(company_contact["rows"]) &&
                company_contact["count"] > 0
            ) {
                list = list.concat(company_contact["rows"]);
            }
            // self.sendResponse(
            //     res,
            //     true,
            //     CONSTANTS.SUCCESSCODE,
            //     list.sort(),
            //     ""
            // );
            // return false;
            let letters = [];
            list.map(function(person) {
                let plainPerson = self.convertToObject(person);
                let nameKey = plainPerson.hasOwnProperty("name")
                    ? "name"
                    : "company_name";
                let alphabate = plainPerson[nameKey].substr(0, 1).toLowerCase();
                let index = letters.indexOf(alphabate);
                if (index === -1) {
                    letters.push(alphabate);
                    let temp = {};
                    temp[alphabate] = [];
                    mapped_data.push(temp);
                    index = letters.length - 1;
                }
                // console.log(
                //     "+++++ index +++++",
                //     index,
                //     "+++++ mapped_data ++++",
                //     mapped_data,
                //     "++++++++++++",
                //     alphabate,
                //     "+++++++++++",
                //     mapped_data[index][alphabate]
                // );
                mapped_data[index][alphabate].push(plainPerson);
            });
            console.log("++++ mapped_data ++++", mapped_data);
        }
        self.sendResponse(
            res,
            true,
            CONSTANTS.SUCCESSCODE,
            mapped_data.sort(),
            ""
        );
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
        if (!contact_person.status) {
            self.sendResponse(
                res,
                false,
                CONSTANTS.SERVERERRORCODE,
                contact_person.data.errors[0].message,
                contact_person.msg
            );
        } else {
            this.clearRedisCacheByModule("PERSON");
            self.sendResponse(
                res,
                true,
                CONSTANTS.SUCCESSCODE,
                contact_person.msg,
                ""
            );
        }
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
        this.clearRedisCacheByModule("PERSON");
        self.sendResponse(
            res,
            true,
            CONSTANTS.SUCCESSCODE,
            contact_person.msg,
            ""
        );
    }
}
export default ContactPersonController;
