import * as fs from "fs";
import DatabaseController from "./DatabaseController";
import * as moment from "moment";
import * as nodemailer from "nodemailer";
import { CONSTANTS } from "../../config/constants";
import * as AWS from "aws-sdk";
import * as bufferFrom from "buffer-from";
import * as dotenv from "dotenv";
dotenv.config();

class BaseController extends DatabaseController {
    public sendResponse(httpResp, statusFlag, statusCode, data, errorMessage) {
        const response = {
            status: statusFlag ? "Success" : "Failure",
            statusCode: statusCode,
            data: data,
            errorMessage: errorMessage
        };
        if (httpResp) {
            httpResp.json(response);
        }
    }

    public isEmpty(myObject) {
        for (var key in myObject) {
            if (myObject.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }

    public compare(a, b) {
        if (a["order"] < b["order"]) return CONSTANTS.MONE;
        if (a["order"] > b["order"]) return CONSTANTS.ONE;
        return CONSTANTS.ZERO;
    }

    public removeLastArrayElement(arr) {
        return arr.slice(CONSTANTS.ZERO, CONSTANTS.MONE);
    }

    public getNextWeekDateByISOWeekDayByCount(dayINeed, weekCount) {
        return moment()
            .add(weekCount + CONSTANTS.ONE, "weeks")
            .isoWeekday(dayINeed);
    }

    public getNextWeekDateByISOWeekDayByDate(dayINeed, weekCount) {
        return moment(weekCount)
            .add(CONSTANTS.ONE, "weeks")
            .isoWeekday(dayINeed);
    }

    public check = (p, o, q = "") =>
        p.reduce((xs, x) => {
            return xs && xs[x] ? xs[x] : null;
        }, o);

    public dotify2(path, object) {
        // console.log('++++ path ++++', path);
        const self = this;
        const objectKeys = Object.keys(object);
        const newObj = {};
        objectKeys.forEach(function(objectKey) {
            if (typeof object[objectKey] == "object") {
                const temp = self.dotify2(
                    path + objectKey + ".",
                    object[objectKey]
                );
                Object.assign(newObj, temp);
            } else {
                newObj[path + objectKey] = object[objectKey];
            }
        });
        return newObj;
    }

    // regx formatter: Apply regx for search query
    public regxFormatter(objParams) {
        const arrFilter = [];
        if (Object.keys(objParams).length) {
            Object.keys(objParams).forEach(key => {
                const objRegx = {};
                objRegx[key] = { $regex: new RegExp(objParams[key], "i") };
                arrFilter.push(objRegx);
            });
        }
        return arrFilter;
    }

    // filterByFormatter
    public filterByFormatter(objParams) {
        const arrFilter = [];
        if (Object.keys(objParams).length) {
            Object.keys(objParams).forEach(key => {
                const obj = {};
                obj[key] = objParams[key];
                arrFilter.push(obj);
            });
        }
        return arrFilter;
    }

    // Return total records/document count
    public getTotalRecordsCount(thisModel, objFilter?) {
        return new Promise((resolve, reject) => {
            thisModel.countDocuments(objFilter).exec((err, totalCount) => {
                if (err) {
                    reject(err);
                }
                resolve(totalCount);
            });
        }).catch(err => err);
    }

    // Create directories based on path
    public mkdirSyncRecursive(directory) {
        const path = directory.replace(/\/$/, "").split("/");
        const mode = parseInt("0777", 8);
        for (let i = 1; i <= path.length; i++) {
            const segment = path.slice(CONSTANTS.ZERO, i).join("/");
            if (!fs.existsSync(segment)) {
                fs.mkdirSync(segment, mode);
            }
        }
    }

    public uploadBase64Image(path, base64Data, imageCategory?) {
        return new Promise((resolve, reject) => {
            try {
                const matches = base64Data.match(
                    /^data:([A-Za-z-+\/]+);base64,(.+)$/
                );
                const imageBuffer = {
                    type: matches[1],
                    data: new Buffer(matches[2], "base64")
                };
                // let imageTypeRegularExpression = /\/(.*?)$/;
                const currDate = Date.now();
                const num = CONSTANTS.THIRTYSIX;
                const startStr = CONSTANTS.TWO;
                const endStr = CONSTANTS.FIFTEEN;
                const mathRandomStr = Math.random()
                    .toString(num)
                    .substring(startStr, endStr);
                const uniqueRandomFileName =
                    imageCategory +
                    "-" +
                    currDate +
                    mathRandomStr +
                    mathRandomStr +
                    ".png";
                // let imageTypeDetected = imageBuffer['type'].match(imageTypeRegularExpression);
                const uploadedFilePath = path + uniqueRandomFileName;
                if (!fs.existsSync(path)) {
                    this.mkdirSyncRecursive(path);
                }

                fs.writeFile(uploadedFilePath, imageBuffer["data"], error => {
                    if (error) {
                        resolve({
                            status: false,
                            data: error,
                            msg: "failed to upload"
                        });
                    } else {
                        resolve({
                            status: true,
                            data: {
                                fileName: uniqueRandomFileName,
                                fullFileName: uploadedFilePath.replace(
                                    "./dist",
                                    ""
                                )
                            },
                            msg: "uploaded successfully"
                        });
                    }
                });
            } catch (error) {
                resolve({
                    status: false,
                    data: error
                });
            }
        }).catch(err => err);
    }

    public dotify(obj: object, level = 1) {
        const res = {};
        function recurse(obj: object, current?: string) {
            for (const key in obj) {
                const value = obj[key];
                let newKey;
                if (
                    !isNaN(parseInt(key)) &&
                    level == CONSTANTS.ZERO &&
                    current.indexOf("$") == CONSTANTS.MONE
                ) {
                    newKey = current ? current + "." + "$" : key;
                } else {
                    newKey = current ? current + "." + key : key;
                }

                if (value && typeof value === "object") {
                    recurse(value, newKey);
                } else {
                    res[newKey] = value;
                }
            }
        }

        recurse(obj);
        return res;
    }

    public guid() {
        const string = "ss-s-s-s-sss".replace(/s/g, this.s4);
        return string.replace(/-/g, "");
    }

    public s4() {
        const num = CONSTANTS.SIXTEEN;
        const startStr = CONSTANTS.ONE;
        const hexDecNum = CONSTANTS.HEXDECNUM;
        const rCount = Math.floor((startStr + Math.random()) * hexDecNum);
        return rCount.toString(num).substring(startStr);
    }

    public async sendEmail(to, subject, text) {
        const from = "support@selfdoc.com";

        const smtpTransport = nodemailer.createTransport({
            host: "smtp.sendgrid.net",
            port: 587,
            secure: false,
            auth: {
                user: "gauravp_iprogrammer", // generated ethereal user
                pass: "7u8i9o0p" // generated ethereal password
            }
        });

        const mailOptions = {
            to: to,
            from: from,
            subject: subject,
            text: text
        };

        // send mail with defined transport object
        var statusLog = true;
        smtpTransport.sendMail(mailOptions, (error, info) => {
            if (error) {
                statusLog = false;
            }
        });
        return statusLog;
    }

    public async getProcessedData(currentModel, reqBody, includeObj = {}) {
        const self = this;
        const arrayFilters = {};
        let sort = [["id", "DESC"]];
        let offset = CONSTANTS.ZERO;
        let limit = CONSTANTS.HUNDRED;
        const arrFilterEq = reqBody["arrayFilters"];

        if (
            reqBody.hasOwnProperty("arrayFilters") &&
            Array.isArray(reqBody["arrayFilters"])
        ) {
            arrFilterEq.forEach(function(item, index) {
                Object.assign(arrayFilters, item);
            });
        }

        if (
            self.check(["sort", "field"], reqBody) != null &&
            self.check(["sort", "sortOrder"], reqBody) != null
        ) {
            const sortValue = reqBody.sort.sortOrder;
            const sortField = reqBody.sort.field;
            sort = [[sortField, sortValue]];
        }

        if (
            reqBody.paginate.page >= 0 &&
            self.check(["paginate", "limit"], reqBody) != null
        ) {
            const page = reqBody.paginate.page;
            const pageSize = reqBody.paginate.limit;
            offset = page * pageSize;
            limit = pageSize;
        }

        let attr = [];
        if (self.check(["selectFilters"], reqBody)) {
            if (reqBody.selectFilters.length > CONSTANTS.ZERO) {
                attr = reqBody.selectFilters;
            }
        }

        const condition = {
            include: includeObj,
            attributes: attr,
            offset: offset,
            limit: limit,
            where: arrayFilters,
            order: sort
        };

        if (attr && attr.constructor === Array && attr.length === 0) {
            delete condition.attributes;
        }
        if (this.isEmpty(includeObj) === true) {
            delete condition.include;
        }

        const getResponse = await this.getAll(currentModel, condition);
        let finalResponse = {};
        if (getResponse && getResponse.hasOwnProperty("data")) {
            finalResponse = getResponse["data"];
            return finalResponse;
        } else {
            return false;
        }
    }

    public async uploadFileOnS3Bucket(attachment, parentFolder) {
        //const bufferFrom = require('buffer-from');
        AWS.config.update({
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY
        });

        const s3 = new AWS.S3();

        const base64String = attachment["fileBody"];
        const fileName = attachment["fileName"];
        const fileExtension = attachment["fileExtension"];
        const bucketKey = parentFolder + "/" + Date.now() + "_" + fileName;

        const buf = new bufferFrom(
            base64String.replace(/^data:([A-Za-z-+\/]+);base64,/, ""),
            "base64"
        );

        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: bucketKey,
            Body: buf,
            ContentType: fileExtension,
            ACL: "public-read",
            ContentDisposition: "inline"
        };
        const response = await s3
            .upload(params, function(err, data) {})
            .promise();
        if (this.check(["Location"], response) != null) {
            return response.Location;
        }
        return false;
    }

    public async removeFileOnS3Bucket(fileObj) {
        AWS.config.update({
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY
        });

        const s3 = new AWS.S3();

        const params = {
            Bucket: process.env.S3_BUCKET,
            Delete: {
                Objects: fileObj
            }
        };

        const response = await s3
            .deleteObjects(params, function(err, data) {})
            .promise();

        return response;
    }
}
export default BaseController;
