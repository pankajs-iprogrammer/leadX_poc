import { CONSTANTS } from "../../config/constants";
import BaseController from "../../shared/controller/BaseController";
import ContactPersonModel from "./person.model";
import User from "../user/user.model";
import Territory from "../master/territory.model";
import Company from "../contact/company.model";
import companyController from "../contact/company.controller";
const companyObj = new companyController();
class ContactPersonController extends BaseController {
    public async addNewContactPerson(reqBody, res, req) {
        const self = this;
        reqBody.created_by = req.session.user_id;
        reqBody.account_id = req.session.account_id;
        const contact_person = await self.createData(
            ContactPersonModel,
            reqBody
        );
        this.sendResponse(
            res,
            true,
            CONSTANTS.SUCCESSCODE,
            contact_person.data,
            contact_person.msg
        );
    }

    public async getAllContactPerson(reqBody, res: object, is_return = 0) {
        const self = this;
        const includeObj = [
            {
                model: User,
                as: "UserRef",
                attributes: ["name", "user_avatar"]
            },
            {
                model: Company,
                attributes: ["id", "company_name"]
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
        const contact_person = await self.getProcessedData(
            ContactPersonModel,
            reqBody,
            includeObj
        );
        if (is_return === 1) {
            return contact_person;
        } else {
            self.sendResponse(
                res,
                true,
                CONSTANTS.SUCCESSCODE,
                contact_person,
                ""
            );
        }
    }

    public async getPersonListInMobileContactStyle(reqBody, res: object) {
        let contact_person = await this.getAllContactPerson(reqBody, res, 1);
        let total_count = 0;
        if (this.check(["sort", "field"], reqBody) == "name") {
            reqBody["sort"]["field"] = "company_name";
        }
        /* Checking here if request body has selectFilters &
         * if yes then if it has name property then changing it to company_name
         */
        if (
            this.check(["selectFilters", 0], reqBody) != null &&
            reqBody["selectFilters"][0].hasOwnProperty("name")
        ) {
            reqBody["selectFilters"][0]["company_name"] =
                reqBody["selectFilters"][0]["name"];
            delete reqBody["selectFilters"][0]["name"];
        }

        if (
            this.check(["searchFilter", 0], reqBody) != null &&
            reqBody["searchFilter"][0].hasOwnProperty("name")
        ) {
            reqBody["searchFilter"][0]["company_name"] =
                reqBody["searchFilter"][0]["name"];
            delete reqBody["searchFilter"][0]["name"];
        }
        let company_contact = await companyObj.getAllContactCompany(
            reqBody,
            res,
            1
        );
        const self = this;
        let mapped_data = [];
        if (
            Array.isArray(contact_person["rows"]) &&
            contact_person["count"] > 0
        ) {
            let self = this;
            let list = self.convertToObject(contact_person["rows"]);
            total_count += parseInt(contact_person["count"]);
            console.log("++++ total_count +++++", total_count);

            if (
                Array.isArray(company_contact["rows"]) &&
                company_contact["count"] > 0
            ) {
                list = list.concat(company_contact["rows"]);
            }

            total_count += parseInt(company_contact["count"]);
            console.log("++++ total_count +++++", company_contact);
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
                    letters = letters.sort();
                    index = letters.indexOf(alphabate);
                    let temp = {};
                    temp[alphabate] = [];
                    mapped_data.splice(index, 0, temp);
                }
                mapped_data[index][alphabate].push(plainPerson);
            });
            console.log("++++ mapped_data ++++", mapped_data);
        }
        let finalResponse = { count: total_count, rows: mapped_data };
        self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, finalResponse, "");
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
}
export default ContactPersonController;
