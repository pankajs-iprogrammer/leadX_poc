import { CONSTANTS } from "../../config/constants";
import BaseController from "../../shared/controller/BaseController";
import LeadStatusModel from "./leadStatus.model";
import ActivityTypeModel from "./activityType.model";
import CurrencyModel from "./currency.model";
import LeadSourceModel from "./leadSource.model";
import TerritoryModel from "./territory.model";
import RoleModel from "./role.model";
import LicenseTypeModel from "./licenseType.model";

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
    public async getAllCountry({ reqBody, res }: { reqBody; res }) {
        const self = this;
        const leadData = await self.getProcessedData(
            TerritoryModel.Country,
            reqBody
        );
        self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, leadData, "");
    }
    public async getAllStateOfThisCountry({ reqBody, res }: { reqBody; res }) {
        const self = this;
        const leadData = await self.getProcessedData(
            TerritoryModel.State,
            reqBody
        );
        self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, leadData, "");
    }
    public async getAllCityOfThisState({ reqBody, res }: { reqBody; res }) {
        const self = this;
        const leadData = await self.getProcessedData(
            TerritoryModel.City,
            reqBody
        );
        self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, leadData, "");
    }
    public async getAllRoles({ reqBody, res }: { reqBody; res }) {
        const self = this;
        const roleData = await self.getProcessedData(RoleModel, reqBody);
        self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, roleData, "");
    }
    public async getlicenseType({ reqBody, res }: { reqBody; res }) {
        const self = this;
        const licensetype = await self.getProcessedData(
            LicenseTypeModel,
            reqBody
        );
        self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, licensetype, "");
    }
}
export default MasterController;
