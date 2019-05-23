import { CONSTANTS } from "../../config/constants";
import BaseController from "../../shared/controller/BaseController";
import SalesFeedModel from "./salesFeed.model";
import User from "../user/user.model";
import Company from "../contact/company.model";
class SalesFeedController extends BaseController {
    public async getAllSalesFeed(reqBody, res: object) {
        const includeObj = [
            {
                model: User,
                as: "UserRef",
                attributes: ["name", "user_avatar"]
            },
            {
                model: Company,
                as: "CompanyRef",
                attributes: ["id", "company_name"]
            }
        ];
        const sales_feed = await this.getProcessedData(
            SalesFeedModel,
            reqBody,
            includeObj
        );
        this.sendResponse(res, true, CONSTANTS.SUCCESSCODE, sales_feed, "");
    }
}
export default SalesFeedController;
