import { CONSTANTS } from "../../config/constants";
import BaseController from "../../shared/controller/BaseController";
import LeadStatusModel from "./leadStatus.model";

class MasterController extends BaseController {
    public async getAllLeadStatus(reqBody, res) {
        const self = this;
        const leadData = await self.getProcessedData(LeadStatusModel, reqBody);
        self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, leadData, "");
    }
}
export default MasterController;
