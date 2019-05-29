import * as Joi from "@hapi/joi";
import * as redis from "redis";
import * as moment from "moment";
import { CONSTANTS } from "../../config/constants";
import BaseController from "../../shared/controller/BaseController";
import LeadModel from "./lead.model";
import UserModel from "../user/user.model";
import Companies from "../contact/company.model";
import PersonModel from "../contact/person.model";
import LeadStatus from "../master/leadStatus.model";
import CurrencyModel from "../master/currency.model";
import Territories from "../master/territory.model";
import SalesFeedModel from "../salesFeed/salesFeed.model";
import LeadSourceModel from "../master/leadSource.model";

const myPipeLine = "my_pipeline";
class LeadController extends BaseController {
    public async addNewLead(reqBody, res, req) {
        const self = this;
        //reqBody.created_by = req.session.user_id;
        //reqBody.account_id = req.session.account_id;
        reqBody.created_by = 1;
        reqBody.account_id = 1;
        reqBody.lead_current_status_id = 1;
        const leadData = await self.createData(LeadModel.Lead, reqBody);
        const lastInsertId = leadData.data.id;
        await this.addStatusLog(reqBody, lastInsertId);
        await this.addSalesFeed(reqBody, lastInsertId, 2);
        if (self.check(["assigned_to"], reqBody) != null) {
            //reqBody.assigned_from = req.session.user_id;
            reqBody.assigned_from = 1;
            await this.addAssignedLog(reqBody, lastInsertId);
        }

        self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, leadData.msg, "");
    }

    public async updateLead(reqBody, res, req) {
        const self = this;
        //reqBody.account_id = req.session.account_id;
        //reqBody.assigned_from = req.session.user_id;
        reqBody.account_id = 1;
        reqBody.assigned_from = 1;
        reqBody.created_by = 1;
        const getData = await self.getById(LeadModel.Lead, reqBody.id);
        const currentStatus = getData.data.lead_current_status_id;
        const currentAssigned = getData.data.assigned_to;

        if (currentStatus !== reqBody.lead_current_status_id) {
            await self.addStatusLog(reqBody, reqBody.id);
        }

        if (currentAssigned !== reqBody.assigned_to) {
            await self.addAssignedLog(reqBody, reqBody.id);
        }

        if (this.check(["is_won"], reqBody) !== null && reqBody.is_won === 1) {
            await this.addSalesFeed(reqBody, reqBody.id, 1);
        }

        const condition = {
            where: {
                id: reqBody.id
            }
        };

        const leadData = await self.updateData(
            LeadModel.Lead,
            reqBody,
            condition
        );
        self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, leadData.msg, "");
    }

    public async addSalesFeed(reqBody, leadId, actionType) {
        const leadStatusLogObj = {
            lead_id: leadId,
            account_id: reqBody.account_id,
            company_id: reqBody.company_id,
            created_by: reqBody.created_by,
            action_type: actionType
        };

        const addSalesFeed = await this.createData(
            SalesFeedModel,
            leadStatusLogObj
        );
        return addSalesFeed;
    }

    public async addStatusLog(reqBody, leadId) {
        const leadStatusLogObj = {
            lead_id: leadId,
            account_id: reqBody.account_id,
            lead_status_id: reqBody.lead_current_status_id
        };

        const addMsg = await this.createData(
            LeadModel.LeadStatusLog,
            leadStatusLogObj
        );
        return addMsg;
    }

    public async addAssignedLog(reqBody, leadId) {
        const leadAssignmentLogObj = {
            lead_id: leadId,
            account_id: reqBody.account_id,
            assigned_from: reqBody.assigned_from,
            assigned_to: reqBody.assigned_to
        };

        const addMsg = await this.createData(
            LeadModel.LeadAssignmentLog,
            leadAssignmentLogObj
        );
        return addMsg;
    }

    public async getAllLeadList({ reqBody, res }: { reqBody; res }) {
        const self = this;
        const includeObj = [
            {
                model: UserModel,
                attributes: ["name", "user_avatar"],
                as: "createdBy"
            },
            {
                model: UserModel,
                attributes: ["name", "user_avatar"],
                as: "assignedTo"
            },
            {
                model: Companies,
                attributes: ["id", "company_name"],
                include: [
                    {
                        model: Territories.Country,
                        attributes: ["id", "name", "iso_code"]
                    },
                    {
                        model: Territories.State,
                        attributes: ["id", "name", "state_code"]
                    },
                    {
                        model: Territories.City,
                        attributes: ["id", "name"]
                    }
                ]
            },
            {
                model: LeadStatus,
                attributes: ["id", "name"]
            },
            {
                model: PersonModel,
                attributes: ["id", "name", "phone_number"]
            },
            {
                model: LeadModel.LeadStatusLog,
                attributes: ["lead_status_id", "created_at"],
                include: [{ model: LeadStatus, attributes: ["name"] }]
            },
            {
                model: CurrencyModel,
                attributes: ["id", "short_name"]
            },
            {
                model: LeadSourceModel,
                attributes: ["id", "name"]
            }
        ];
        const leadData = await self.getProcessedData(
            LeadModel.Lead,
            reqBody,
            includeObj
        );
        self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, leadData, "");
    }

    public async getLeadOne(reqBody, res) {
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
        const leadData = await self.getOne(LeadModel, condition);

        if (self.check(["data", "id"], leadData) != null) {
            self.sendResponse(
                res,
                true,
                CONSTANTS.SUCCESSCODE,
                leadData.data,
                ""
            );
        } else {
            self.sendResponse(
                res,
                true,
                CONSTANTS.SERVERERRORCODE,
                leadData.data,
                ""
            );
        }
    }

    public async getRevenueTotal(reqBody, res, req) {
        let revenueObj = {};
        if (
            this.check(["revenueType"], reqBody) &&
            reqBody.revenueType == myPipeLine
        ) {
            revenueObj = {
                revenue: 3763,
                leadsTotal: 150,
                hitRate: 20.6,
                account: {
                    id: 1,
                    name: "Cox Enterprise",
                    currency: {
                        id: 1,
                        short_name: "USD"
                    }
                }
            };
        } else {
            revenueObj = {
                revenue: 27836,
                leadsTotal: 2768,
                hitRate: 12.9,
                account: {
                    id: 1,
                    name: "Cox Enterprise",
                    currency: {
                        id: 1,
                        short_name: "USD"
                    }
                }
            };
        }
        this.sendResponse(res, true, CONSTANTS.SUCCESSCODE, revenueObj, "");
    }
}
export default LeadController;
