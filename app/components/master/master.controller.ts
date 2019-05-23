import { CONSTANTS } from "../../config/constants";
import BaseController from "../../shared/controller/BaseController";
import LeadStatusModel from "./leadStatus.model";
import ActivityTypeModel from "./activityType.model";
import CurrencyModel from "./currency.model";
import LeadSourceModel from "./leadSource.model";

class MasterController extends BaseController {
    public async getAllLeadStatus({ reqBody, res }: { reqBody; res }) {
        const self = this;
        const leadData = await self.getProcessedData(LeadStatusModel, reqBody);
        self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, leadData, "");
    }

    public async getAllActivityType({ reqBody, res }: { reqBody; res }) {
        const self = this;
        const leadData = await self.getProcessedData(
            ActivityTypeModel,
            reqBody
        );
        self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, leadData, "");
    }

    public async getAllCurrency({ reqBody, res }: { reqBody; res }) {
        const self = this;
        const leadData = await self.getProcessedData(CurrencyModel, reqBody);
        self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, leadData, "");
    }

    public async getAllLeadSource({ reqBody, res }: { reqBody; res }) {
        const self = this;
        const leadData = await self.getProcessedData(LeadSourceModel, reqBody);
        self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, leadData, "");
    }
}
export default MasterController;
