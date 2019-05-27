import { CONSTANTS } from "../../config/constants";
import BaseController from "../../shared/controller/BaseController";
import ContactPersonModel from "./person.model";
import User from "../user/user.model";
import Territory from "../master/territory.model";

class ContactPersonController extends BaseController {
    public async addNewContactPerson(reqBody, res, req) {
        const self = this;
        // if (!req.session.user_id) {
        //     self.sendResponse(
        //         res,
        //         true,
        //         CONSTANTS.UNAUTHORISED,
        //         "",
        //         "Unauthorised access"
        //     );
        //     return false;
        // }
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

    public async getAllContactPerson(reqBody, res: object) {
        const self = this;
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
        const contact_person = await self.getProcessedData(
            ContactPersonModel,
            reqBody,
            includeObj
        );
        self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, contact_person, "");
    }

    public async getPersonListInMobileContactStyle(reqBody, res: object) {
        const self = this;
        const includeObj = {
            model: User,
            as: "UserRef",
            attributes: ["name", "user_avatar"]
        };
        const contact_person = await self.getProcessedData(
            ContactPersonModel,
            reqBody,
            includeObj
        );
        let newList = [];
        console.log("+++ List ++++", contact_person["rows"]);
        if (
            Array.isArray(contact_person["rows"]) &&
            contact_person["rows"].length > 0
        ) {
            let self = this;
            let list = self.convertToObject(contact_person["rows"]);
            list.map(function(person) {
                let plainPerson = self.convertToObject(person);
                let letter = plainPerson["name"].substr(0, 1);
                let index = self.addItemInList(letter, plainPerson, list);
                console.log("++++ index ++++", index);
            });
        }
        self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, contact_person, "");
    }

    public addItemInList(letter, item, list) {
        let index = list.findIndex(i => {
            let key = Object.keys(i);
            if (key === letter) {
                return i;
            }
        });
        // if (index) {
        //     item[index].push();
        // }
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
