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
import db from "../../config/db.config";
const Op = db.Sequelize.Op;
import UserController from "../user/user.controller";
let userCtrl = new UserController();
import LicenseType from "../master/licenseType.model";

const myPipeLine = "my_pipeline";
class LeadController extends BaseController {
    public async addNewLead(reqBody, res, req) {
        const self = this;
        const userId = reqBody.user_id;
        reqBody.created_by = userId;
        reqBody.account_id = 1;
        reqBody.lead_current_status_id = 1;
        if (self.check(["user_id"], reqBody) != null) {
            let userCtrl = new UserController();
            const userData = await userCtrl.getUserById(reqBody.user_id);
            const roleType = userData.role.actual_name;
            if (
                roleType == "SALES_PROFESSIONAL" ||
                roleType == "SALES_MANAGER"
            ) {
                reqBody.lead_current_status_id = 2;
            }
        }
        const leadData = await self.createData(LeadModel.Lead, reqBody);
        const lastInsertId = leadData.data.id;

        if (lastInsertId) {
            await this.addStatusLog(reqBody, lastInsertId);
            if (reqBody.lead_current_status_id == 2) {
                await this.addSalesFeed(reqBody, lastInsertId, CONSTANTS.TWO);
            }

            if (self.check(["assigned_to"], reqBody) != null) {
                //reqBody.assigned_from = req.session.user_id;
                reqBody.assigned_from = 1;
                await this.addAssignedLog(reqBody, lastInsertId);
            }
        }

        if (!leadData.status) {
            self.sendResponse(
                res,
                false,
                CONSTANTS.SERVERERRORCODE,
                leadData.data,
                leadData.msg
            );
        } else {
            self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, leadData, "");
        }
    }

    public async updateLead(reqBody, res, req) {
        const self = this;
        //reqBody.account_id = req.session.account_id;
        //reqBody.assigned_from = req.session.user_id;
        const userId = reqBody.user_id;
        reqBody.account_id = 1;
        reqBody.assigned_from = userId;
        //reqBody.created_by = userId;
        const getData = await self.getById(LeadModel.Lead, reqBody.id);
        const currentStatus = getData.data.lead_current_status_id;
        const currentAssigned = getData.data.assigned_to;

        if (currentStatus !== reqBody.lead_current_status_id) {
            await self.addStatusLog(reqBody, reqBody.id);
        }

        if (currentAssigned !== reqBody.assigned_to) {
            await self.addAssignedLog(reqBody, reqBody.id);
        }

        if (
            reqBody.hasOwnProperty("is_bell_ringed") &&
            reqBody.is_bell_ringed === CONSTANTS.ONE
        ) {
            await this.addSalesFeed(reqBody, reqBody.id, CONSTANTS.ONE);
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
        if (!leadData.status) {
            self.sendResponse(
                res,
                false,
                CONSTANTS.SERVERERRORCODE,
                leadData.data,
                leadData.msg
            );
        } else {
            self.sendResponse(
                res,
                true,
                CONSTANTS.SUCCESSCODE,
                leadData.msg,
                ""
            );
        }
    }

    public async addSalesFeed(reqBody, leadId, actionType) {
        const leadStatusLogObj = {
            lead_id: leadId,
            account_id: reqBody.account_id,
            company_id: reqBody.company_id,
            created_by: reqBody.user_id,
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
        let customWhere = {};
        if (self.check(["from"], reqBody) == "my_pipeline") {
            if (self.check(["user_id"], reqBody) != null) {
                let userCtrl = new UserController();
                const userData = await userCtrl.getUserById(reqBody.user_id);
                const roleType = userData.role.actual_name;
                if (roleType == "NON_SALES") {
                    Object.assign(reqBody.arrayFilters[0], {
                        created_by: reqBody.user_id
                    });
                } else if (roleType == "SALES_PROFESSIONAL") {
                    Object.assign(reqBody.arrayFilters[0], {
                        assigned_to: reqBody.user_id
                    });
                } else {
                    customWhere = {
                        $or: [
                            {
                                $and: [
                                    { assigned_to: null },
                                    { created_by: reqBody.user_id }
                                ]
                            },
                            {
                                $and: [
                                    { lead_current_status_id: 1 },
                                    { is_hand_over: 1 }
                                ]
                            },
                            { assigned_to: reqBody.user_id }
                            //{ lead_current_status_id: 1 }
                        ]
                    };
                }
            }
        } else {
            customWhere = { lead_current_status_id: { $ne: 1 } };
        }

        const includeObj = [
            {
                model: UserModel,
                attributes: ["id", "name", "user_avatar"],
                as: "createdBy",
                include: [
                    {
                        model: LicenseType,
                        attributes: ["id", "actual_name", "display_name"]
                    }
                ]
            },
            {
                model: UserModel,
                attributes: ["id", "name", "user_avatar"],
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
            includeObj,
            customWhere
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

    private async getMyTotalRevenue(user_id, revenue_type) {
        let condition = {
            where: {
                is_won: 1,
                lead_current_status_id: {
                    [Op.ne]: 1
                }
            },
            attributes: [
                [
                    db.Sequelize.fn("sum", db.Sequelize.col("lead_value")),
                    "total_lead_value"
                ]
            ]
        };
        console.log("++++ user_id ++++", user_id);
        console.log("++++ revenue_type ++++", revenue_type);

        if (revenue_type === "my_pipeline") {
            condition["where"]["created_by"] = user_id;
        }
        const leadData = await this.getAll(LeadModel.Lead, condition);
        return leadData["data"];
    }

    private async getMyTotalLeads(user_id, revenue_type) {
        let condition = {
            where: {
                lead_current_status_id: {
                    [Op.ne]: 1
                }
            },
            attributes: [
                [
                    db.Sequelize.fn("count", db.Sequelize.col("id")),
                    "total_leads"
                ]
            ]
        };
        console.log("++++ user_id ++++", user_id);
        console.log("++++ revenue_type ++++", revenue_type);
        if (revenue_type === "my_pipeline") {
            condition["where"]["created_by"] = user_id;
        }
        const leadData = await this.getAll(LeadModel.Lead, condition);
        return leadData["data"];
    }

    private async getTotalClosedLeads(user_id, revenue_type) {
        let condition = {
            where: {
                lead_current_status_id: 6
            },
            attributes: [
                [
                    db.Sequelize.fn("count", db.Sequelize.col("id")),
                    "total_leads"
                ]
            ]
        };
        console.log("++++ revenue_type ++++", revenue_type);
        if (revenue_type === "my_pipeline") {
            condition["where"]["created_by"] = user_id;
        }
        const leadData = await this.getAll(LeadModel.Lead, condition);
        return leadData["data"];
    }

    public async getRevenueTotal(reqBody, res, req) {
        let user_id = reqBody["user_id"];
        let revenue_type = reqBody["revenueType"];
        let totalRevenue = await this.getMyTotalRevenue(user_id, revenue_type);
        let totalLeadsObj = await this.getMyTotalLeads(user_id, revenue_type);
        let totalLostLeadsObj = await this.getTotalClosedLeads(
            user_id,
            revenue_type
        );
        totalRevenue = this.convertToObject(totalRevenue);
        totalLeadsObj = this.convertToObject(totalLeadsObj);
        totalLostLeadsObj = this.convertToObject(totalLostLeadsObj);
        let total_lost_leads = this.check(
            ["rows", 0, "total_lead_value"],
            totalLostLeadsObj
        );
        total_lost_leads = total_lost_leads ? total_lost_leads : 0;

        let totalWonLeads = totalRevenue["count"]
            ? parseInt(totalRevenue["count"])
            : 0;
        let totalLeads = totalLeadsObj["count"]
            ? parseInt(totalLeadsObj["count"])
            : 0;
        console.log("++++++ totalWonLeads +++++", totalWonLeads);
        console.log("++++++ total_lost_leads +++++", total_lost_leads);
        let hitRate =
            (totalWonLeads / (totalWonLeads + total_lost_leads)) * 100;
        let revenue = this.check(["rows", 0, "total_lead_value"], totalRevenue);

        let response = {
            revenue: revenue ? revenue : 0,
            leadsTotal: totalLeads ? totalLeads : 0,
            hitRate: hitRate,
            account: {
                id: 1,
                logo:
                    "https://s3.eu-west-2.amazonaws.com/lead-x/blue-and-green-circular-fish-company.png?response-content-disposition=inline&X-Amz-Security-Token=AgoGb3JpZ2luEMj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmFwLXNvdXRoLTEigAI%2F2piDCxTVpEGsHFiNviO%2B2fmtfCxxG%2F5oMtLwkM4EEKnDGuOy82DP%2BkfUEFtKTjkxSX1vqYskF0Rga1db%2FI%2FgDPFzs4hYNK%2FZ7LrE3aZSoO1sbLTOi0r9%2FELqkNxR8ZuRXfHdVfLLs13vz9Lvg7kP%2ByaPT9jxC8B1c%2BXF%2F4893Q5UDTERCG0vv1OVBTOxHKM%2FTSk7xzBqctco6dQw39z50qOQ4VXSCNkq5%2FH%2FKJ9pHS%2BpjSvxQqOVQtwyASEfpUox1CBGixl2UbgDPfqAr%2Fjo1xaVwRHxVIMjyOlgiQLKrj0qGEYpzUxpW2mRs3E3YrmzCojKasWsXaZbvIN1dDEnKuQDCIz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNDk3NjE1OTQzMjg2IgxOT4ERI8vO5pUypzkquAMrtfmxcsRWC%2Fbev8hDzQiCPhzFGNhwT4hX%2B%2B%2Ffih%2B2v7YzcFCo8%2BbZsNSOYl14OrpQI85YWDt01QURJBbWQ8xYsVsdIPeASeonc1WmfojE4YUGxl8NdsLBZr5OD42rm8rDgVS0cV%2FsuvqpcKAMvqgRJhwz0UnBhzldLrMCVrSNaZ5IYLGgor6YLNR25QuUhl9Xp1Y3LwQC5d5VnW4n8FinqoDYfBqAWbVO6yYdWOTLx7YAHl4OOhjy%2FY%2BOqMatrPShMKt34RGHBeT5ZZrI9p7DsdYoZeRpAds4FYhfUvCqecs%2BTkTByMyU%2B13vtf5l0fYCb2q9HqbODuVsQ4d6Y1kEQI5TeTBaxHjMcwQCSafWWmvJ7nZjNtufVM2XTRotE3%2B28f93YjU%2BDFzUzGQOe7C12C7FQ%2B1GFUevNVoOVT0pOmxEaLTLkOdGwEulJpdrRHx0EpxgClaGOg5h5qRyuB1Yn6%2BYKDebUhgXOSJP5rzD58%2FCuV8PIvgE9Lh4K8PydpbX0hPVVBOnf1s1Bua8smXkx36U8tF3tEOclK49uqV6Qu0ItV141thMDJtgx5%2BhLWG0kl4QfxDNczDEj8TnBQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20190531T105619Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAXHXBYWZ3JLTQDSAH%2F20190531%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Signature=9bbf34c73c45417c3c4cfe386df56fea31051c39be1945b75da446376faec875",
                name: "Cox Enterprise",
                currency: {
                    id: 1,
                    short_name: "USD"
                }
            }
        };

        this.sendResponse(res, true, CONSTANTS.SUCCESSCODE, response, "");
        return false;
    }
}
export default LeadController;
