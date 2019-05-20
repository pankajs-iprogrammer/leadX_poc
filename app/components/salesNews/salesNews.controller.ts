import * as Joi from '@hapi/joi';
import * as redis from 'redis';
import * as moment from 'moment';
import * as AWS from 'aws-sdk';

import * as dotenv from "dotenv";
dotenv.config();
import { CONSTANTS } from '../../config/constants';
import BaseController from '../../shared/controller/BaseController';
import SalesNewsModel from './salesNews.model';

class SalesNewsController extends BaseController {

  public async addNewSalesNews(reqBody, res) {
    let self = this;
    reqBody.user_id = 1;
    let attachment = reqBody.attachment;

    if (self.check(["fileName"], attachment) != null && self.check(["fileBody"], attachment) != null && self.check(["fileExtension"], attachment) != null) {
      const s3UploadFile = await self.uploadFileOnS3Bucket(attachment, "sales_news");
      if (s3UploadFile != "") {
        reqBody.cover_image = s3UploadFile;
      }
    }

    SalesNewsModel.create(reqBody).then(salesNews => {
      self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, salesNews, '');
    }).catch(function (err) {
      self.sendResponse(res, true, CONSTANTS.SERVERERRORCODE, err, '');
    })
  }

  public async updateSalesNews(reqBody, res) {
    let self = this;
    const id = reqBody.id;
    let attachment = reqBody.attachment;
    
    if (self.check(["fileName"], attachment) != null && self.check(["fileBody"], attachment) != null && self.check(["fileExtension"], attachment) != null && self.check(["cover_image_old"], reqBody) != null) {
      const s3UploadFile = await self.uploadFileOnS3Bucket(attachment, "sales_news");
      if (s3UploadFile != "") {
        reqBody.cover_image = s3UploadFile;
      }

      const filePath = reqBody.cover_image_old;
      const fileName = filePath.replace(/^.*[\\\/]/, '');
      const bucketKey = "sales_news" + "/" + fileName;
      const fileObj = [];
      fileObj.push({Key : bucketKey});
      await self.removeFileOnS3Bucket(fileObj);
    }

    SalesNewsModel.update(reqBody,
      { where: { id: reqBody.id } },
    ).then(() => {
      self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, "updated successfully a customer with id = " + id, '');
    });
  }

  public async uploadFileOnS3Bucket(attachment, parentFolder) {
    const bufferFrom = require('buffer-from');
    AWS.config.update({
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3();

    const base64String = attachment["fileBody"];
    const fileName = attachment["fileName"];
    const fileExtension = attachment["fileExtension"];
    const bucketKey = parentFolder + "/" + Date.now() + "_" + fileName;

    const buf = new bufferFrom(base64String.replace(/^data:([A-Za-z-+\/]+);base64,/, ""), 'base64');

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: bucketKey,
      Body: buf,
      ContentType: fileExtension,
      ACL: 'public-read',
      ContentDisposition: 'inline',
    };
    const response = await s3.upload(params, function (err, data) {
    }).promise();
    if (this.check(["Location"], response) != null) {
      return response.Location;
    }
    return false;
  }

  public async removeFileOnS3Bucket(fileObj){
    AWS.config.update({
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3();
    
    const params = {
        Bucket: process.env.S3_BUCKET,
        Delete : {
            Objects: fileObj,
        },
    };
    
    const response = await s3.deleteObjects(params, function (err, data) {
    }).promise();
    
    return response;
  }

  public async deleteSalesNews(reqBody, res) {
    let self = this;
    const id = reqBody.id;
    reqBody.is_deleted = 1;

    SalesNewsModel.update(reqBody,
      { where: { id: reqBody.id } },
    ).then(() => {
      self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, "deleted successfully a customer with id = " + id, '');
    });
  }

  public async allSalesNewsList(reqBody, res) {
    let objectFilters = {};
    if (reqBody.hasOwnProperty("arrayFilters") && Array.isArray(reqBody["arrayFilters"])) {
      reqBody["arrayFilters"].forEach(function (item, index) {
          Object.assign(objectFilters, item);
      });
    }
    const condition = {
      where: objectFilters
    };
    
    SalesNewsModel.findAll(condition).then(salesNews => {
      this.sendResponse(res, true, CONSTANTS.SUCCESSCODE, salesNews, '');
    })
  }

}
export default SalesNewsController;
