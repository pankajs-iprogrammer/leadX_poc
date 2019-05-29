import * as Joi from "@hapi/joi";
import * as redis from "redis";
import * as moment from "moment";
import { CONSTANTS } from "../../config/constants";
import BaseController from "../../shared/controller/BaseController";
import SalesNewsModel from "./salesNews.model";
import User from "../user/user.model";

class SalesNewsController extends BaseController {
    public async addNewSalesNews(reqBody, res, req) {
        const self = this;
        reqBody.created_by = req.session.user_id;
        reqBody.account_id = req.session.account_id;
        const attachment = reqBody.attachment;

        const fileName = self.check(["fileName"], attachment);
        const fileBody = self.check(["fileBody"], attachment);
        const fileExtension = self.check(["fileExtension"], attachment);

        if (fileName != null && fileBody != null && fileExtension != null) {
            const s3UploadFile = await self.uploadFileOnS3Bucket(
                attachment,
                "sales_news"
            );
            if (s3UploadFile != "") {
                reqBody.cover_image = s3UploadFile;
            }
        }

        const salesNews = await self.createData(SalesNewsModel, reqBody);
        if (!salesNews.status) {
            self.sendResponse(
                res,
                false,
                CONSTANTS.SERVERERRORCODE,
                salesNews.data.errors[0].message,
                salesNews.msg
            );
        } else {
            self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, salesNews, "");
        }
    }

    public async updateSalesNews(reqBody, res) {
        const self = this;

        const attachment = reqBody.attachment;

        const fileName = self.check(["fileName"], attachment);
        const fileBody = self.check(["fileBody"], attachment);
        const fileExtension = self.check(["fileExtension"], attachment);
        const coverIm = self.check(["cover_image_old"], reqBody);
        if (
            fileName != null &&
            fileBody != null &&
            fileExtension != null &&
            coverIm != null
        ) {
            const s3UploadFile = await self.uploadFileOnS3Bucket(
                attachment,
                "sales_news"
            );
            if (s3UploadFile != "") {
                reqBody.cover_image = s3UploadFile;
            }

            const filePath = reqBody.cover_image_old;
            const fileNewName = filePath.replace(/^.*[\\\/]/, "");
            const bucketKey = "sales_news" + "/" + fileNewName;
            const fileObj = [];
            fileObj.push({ Key: bucketKey });
            await self.removeFileOnS3Bucket(fileObj);
        }

        const condition = {
            where: {
                id: reqBody.id
            }
        };

        const salesNews = await self.updateData(
            SalesNewsModel,
            reqBody,
            condition
        );
        if (!salesNews.status) {
            self.sendResponse(
                res,
                false,
                CONSTANTS.SERVERERRORCODE,
                salesNews.data.errors[0].message,
                salesNews.msg
            );
        } else {
            self.sendResponse(
                res,
                true,
                CONSTANTS.SUCCESSCODE,
                salesNews.msg,
                ""
            );
        }
    }

    public async deleteSalesNews(reqBody, res) {
        const self = this;
        reqBody.is_deleted = 1;

        const condition = {
            where: {
                id: reqBody.id
            }
        };

        const salesNews = await self.updateData(
            SalesNewsModel,
            reqBody,
            condition
        );
        self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, salesNews.msg, "");
    }

    public async getAllSalesNewsList(reqBody, res) {
        const self = this;
        const includeObj = {
            model: User,
            attributes: ["name", "user_avatar"]
        };
        const salesNews = await self.getProcessedData(
            SalesNewsModel,
            reqBody,
            includeObj
        );
        self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, salesNews, "");
    }

    public async getSalesNewsOne(reqBody, res) {
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
            include: { model: User, attributes: ["name", "user_avatar"] },
            where: arrayFilters
        };
        const salesNews = await self.getOne(SalesNewsModel, condition);

        if (self.check(["data", "id"], salesNews) != null) {
            self.sendResponse(
                res,
                true,
                CONSTANTS.SUCCESSCODE,
                salesNews.data,
                ""
            );
        } else {
            self.sendResponse(
                res,
                true,
                CONSTANTS.SERVERERRORCODE,
                salesNews.data,
                ""
            );
        }
    }

    public async getSalesNewsById(reqBody, res) {
        const self = this;
        const condition = {
            include: { model: User, attributes: ["name", "user_avatar"] },
            where: reqBody.id
        };
        const salesNews = await self.getOne(SalesNewsModel, condition);

        if (self.check(["data", "id"], salesNews) != null) {
            self.sendResponse(
                res,
                true,
                CONSTANTS.SUCCESSCODE,
                salesNews.data,
                ""
            );
        } else {
            self.sendResponse(
                res,
                true,
                CONSTANTS.SERVERERRORCODE,
                salesNews.data,
                ""
            );
        }
    }
}
export default SalesNewsController;
