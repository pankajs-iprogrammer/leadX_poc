import * as Joi from "@hapi/joi";
import * as redis from "redis";
import * as moment from "moment";
import { CONSTANTS } from "../../config/constants";
import BaseController from "../../shared/controller/BaseController";
import LeadModel from "./lead.model";

class LeadController extends BaseController {
    public async addNewLead(reqBody, res) {
        const self = this;
        reqBody.created_by = 1;
        reqBody.account_id = 1;
        const leadData = await self.createData(LeadModel.Lead, reqBody);
        const lastInsertId = leadData.data.id;
        await this.addStatusLog(reqBody, lastInsertId);

        if (self.check(["assigned_to"], reqBody) != null) {
            await this.addAssignedLog(reqBody, lastInsertId);
        }

        self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, leadData.msg, "");
    }

    public async updateLead(reqBody, res) {
        const self = this;
        reqBody.account_id = 1;
        const getData = await self.getById(LeadModel.Lead, reqBody.id);
        const currentStatus = getData.data.lead_current_status_id;
        const currentAssigned = getData.data.assigned_to;

        if (currentStatus !== reqBody.lead_current_status_id) {
            await self.addStatusLog(reqBody, reqBody.id);
        }

        if (currentAssigned !== reqBody.assigned_to) {
            await self.addAssignedLog(reqBody, reqBody.id);
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
        reqBody.assigned_from = 1;
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

    public async getAllLeadList(reqBody, res) {
        const self = this;
        const leadData = await self.getProcessedData(LeadModel.Lead, reqBody);
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
}
export default LeadController;
