import { CONSTANTS } from "../../config/constants";
import BaseController from "../../shared/controller/BaseController";
import ContactCompanyModel from "./company.model";
import User from "../user/user.model";
import Territory from "../master/territory.model";
import * as redis from "redis";
const client = redis.createClient();
class ContactCompanyController extends BaseController {
    public async addNewContactCompany(reqBody, res, req) {
        const self = this;
        reqBody.created_by = req.session.user_id;
        reqBody.account_id = req.session.account_id;
        const contact_company = await self.createData(
            ContactCompanyModel,
            reqBody
        );
        if (!contact_company.status) {
            self.sendResponse(
                res,
                false,
                CONSTANTS.SERVERERRORCODE,
                "",
                contact_company.msg
            );
        } else {
            this.clearRedisCacheByModule("COMPANY");
            self.sendResponse(
                res,
                true,
                CONSTANTS.SUCCESSCODE,
                contact_company,
                ""
            );
        }
    }
    public async getAllContactCompany(reqBody, res: object, is_return = 0) {
        const includeObj = [
            {
                model: User,
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
        const hashcode = "COMPANY_" + self.hashCode(jsonReqBody);
        var contactCompanyData = [];
        const contact_company = await self.getProcessedData(
            ContactCompanyModel,
            reqBody,
            includeObj
        );
        client.get(hashcode, function(err, data) {
            if (data) {
                const contactPerson = JSON.parse(data);
                contactCompanyData = [
                    {
                        msg: "Response is coming from Redis",
                        data: contactPerson
                    }
                ];
                self.sendResponse(
                    res,
                    true,
                    CONSTANTS.SUCCESSCODE,
                    contactCompanyData,
                    ""
                );
            } else {
                client.set(hashcode, JSON.stringify(contact_company));
                contactCompanyData = [
                    { msg: "Response is coming from DB", data: contact_company }
                ];
                self.sendResponse(
                    res,
                    true,
                    CONSTANTS.SUCCESSCODE,
                    contactCompanyData,
                    ""
                );
            }
        });

        if (is_return === 1) {
            return contact_company;
        }
    }

    public async getContactCompanyOne(reqBody, res: object) {
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
        const contact_company = await self.getOne(
            ContactCompanyModel,
            condition
        );
        if (self.check(["data", "id"], contact_company) != null) {
            self.sendResponse(
                res,
                true,
                CONSTANTS.SUCCESSCODE,
                contact_company.data,
                ""
            );
        } else {
            self.sendResponse(
                res,
                true,
                CONSTANTS.SERVERERRORCODE,
                contact_company.data,
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
        const contact_company = await self.updateData(
            ContactCompanyModel,
            reqBody,
            condition
        );
        if (!contact_company.status) {
            self.sendResponse(
                res,
                false,
                CONSTANTS.SERVERERRORCODE,
                contact_company.data.errors[0].message,
                contact_company.msg
            );
        } else {
            this.clearRedisCacheByModule("COMPANY");
            self.sendResponse(
                res,
                true,
                CONSTANTS.SUCCESSCODE,
                contact_company.msg,
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
        const contact_company = await self.updateData(
            ContactCompanyModel,
            reqBody,
            condition
        );
        this.clearRedisCacheByModule("COMPANY");
        self.sendResponse(
            res,
            true,
            CONSTANTS.SUCCESSCODE,
            contact_company.msg,
            ""
        );
    }
}
export default ContactCompanyController;
