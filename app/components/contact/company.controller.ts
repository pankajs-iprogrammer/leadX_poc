import { CONSTANTS } from "../../config/constants";
import BaseController from "../../shared/controller/BaseController";
import ContactCompanyModel from "./company.model";

class ContactCompanyController extends BaseController {
    public async addNewContactCompany(reqBody, res) {
        const self = this;
        const contact_company = await self.createData(
            ContactCompanyModel,
            reqBody
        );
        self.sendResponse(
            res,
            true,
            CONSTANTS.SUCCESSCODE,
            contact_company.data,
            ""
        );
    }
    public async getAllContactCompany(reqBody, res: object) {
        const self = this;
        const contact_company = await self.getProcessedData(
            ContactCompanyModel,
            reqBody
        );
        self.sendResponse(
            res,
            true,
            CONSTANTS.SUCCESSCODE,
            contact_company,
            ""
        );
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
        self.sendResponse(
            res,
            true,
            CONSTANTS.SUCCESSCODE,
            contact_company.msg,
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
        const contact_company = await self.updateData(
            ContactCompanyModel,
            reqBody,
            condition
        );
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
