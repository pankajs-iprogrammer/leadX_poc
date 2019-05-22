import { CONSTANTS } from "../../config/constants";
import BaseController from "../../shared/controller/BaseController";
import SalesFeedModel from "./salesFeed.model";

class SalesFeedController extends BaseController {
    public async getAllSalesFeed(reqBody, res: object) {
        const includeObj = {};
        const sales_feed = await this.getProcessedData(
            SalesFeedModel,
            reqBody,
            includeObj
        );
        this.sendResponse(res, true, CONSTANTS.SUCCESSCODE, sales_feed, "");
    }
}
export default SalesFeedController;
