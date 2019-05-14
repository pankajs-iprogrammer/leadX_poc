import * as fs from "fs";
import * as moment from 'moment';
import * as nodemailer from 'nodemailer';
import { CONSTANTS }  from '../../config/constants';

class BaseController {

    public sendResponse(httpResp, statusFlag, statusCode, data, errorMessage) {
        const response = {
            'status': statusFlag ? 'Success' : 'Failure',
            'statusCode': statusCode,
            'data': data,
            'errorMessage': errorMessage,
        };
        if (httpResp) {
            httpResp.json(response);
        }
    }

    public compare(a, b) {
        if (a["order"] < b["order"])
            return -1;
        if (a["order"] > b["order"])
            return 1;
        return 0;
    }

    public removeLastArrayElement(arr) {
        return arr.slice(0, -1);
    }

    public getNextWeekDateByISOWeekDayByCount(dayINeed, weekCount) {
        return moment().add(weekCount + 1, 'weeks').isoWeekday(dayINeed);
    }

    public getNextWeekDateByISOWeekDayByDate(dayINeed, weekCount) {
        return moment(weekCount).add(1, 'weeks').isoWeekday(dayINeed);
    }

    public check = (p, o, q = "") => p.reduce((xs, x) => {
        if (x == "$") {
            if (Array.isArray(xs)) {
                const tempXS = xs.find((item) => {
                    return item._id.toString() == q.toString()
                });
                if (tempXS) {
                    if (tempXS.hasOwnProperty("_id"))
                        tempXS["_id"] = (tempXS["_id"]) ? tempXS["_id"].toString() : tempXS["_id"];
                    tempXS["index"] = xs.findIndex((item) => item._id.toString() == q.toString());
                    return tempXS;
                } else {
                    if (xs.hasOwnProperty("_id"))
                        xs["_id"] = (xs["_id"]) ? xs["_id"].toString() : xs["_id"];
                    return xs
                }
            } else {
                return xs;
            }

        } else {
            return (xs && xs[x]) ? xs[x] : null
        }
    }, o);

    public dotify2(path, object) {
        // console.log('++++ path ++++', path);        
        const self = this;
        const objectKeys = Object.keys(object);
        const newObj: any = {};
        objectKeys.forEach(function (objectKey) {
            if (typeof object[objectKey] == "object") {
                const temp = self.dotify2(path + objectKey + '.', object[objectKey]);
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
                objRegx[key] = { $regex: new RegExp(objParams[key], 'i') }
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
        const path = directory.replace(/\/$/, '').split('/');
        const mode = parseInt('0777', 8);
        for (let i = 1; i <= path.length; i++) {
            const segment = path.slice(0, i).join('/');
            if (!fs.existsSync(segment)){
                fs.mkdirSync(segment, mode)
            }
        }
    }

    public uploadBase64Image(path, base64Data, imageCategory?) {
        return new Promise((resolve, reject) => {
            try {
                const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                const imageBuffer = {
                    type: matches[1],
                    data: new Buffer(matches[2], 'base64'),
                }
                // let imageTypeRegularExpression = /\/(.*?)$/;
                const currDate = Date.now();
                const mathRandomStr = Math.random().toString(CONSTANTS.THIRTYSIX).substring(CONSTANTS.TWO, CONSTANTS.FIFTEEN);
                const uniqueRandomFileName = (imageCategory + '-' + currDate + mathRandomStr + mathRandomStr + '.png');
                // let imageTypeDetected = imageBuffer['type'].match(imageTypeRegularExpression);
                const uploadedFilePath = path + uniqueRandomFileName;
                if (!fs.existsSync(path)) {
                    this.mkdirSyncRecursive(path);
                }
                require('fs').writeFile(uploadedFilePath, imageBuffer['data'],
                    (error) => {
                        if (error) {
                            resolve({
                                status: false,
                                data: error,
                                msg: 'failed to upload',
                            });
                        } else {
                            resolve({
                                status: true,
                                data: {
                                    fileName: uniqueRandomFileName,
                                    fullFileName: uploadedFilePath.replace('./dist', ''),
                                },
                                msg: 'uploaded successfully',
                            });
                        }
                    });
            }
            catch (error) {
                resolve({
                    status: false,
                    data: error,
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
                if (!isNaN(parseInt(key)) && level == 0 && current.indexOf('$') == -1) {
                    newKey = (current ? current + '.' + '$' : key);
                } else {
                    newKey = (current ? current + '.' + key : key);
                }

                if (value && typeof value === 'object') {
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
        return Math.floor((1 + Math.random()) * 0x10000).toString(CONSTANTS.SIXTEEN).substring(1);
    }

    public async sendEmail(to, subject, text) {
        const from = 'support@selfdoc.com';

        const smtpTransport = nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 587,
            secure: false,
            auth: {
                user: 'gauravp_iprogrammer', // generated ethereal user
                pass: '7u8i9o0p', // generated ethereal password
            },
        });

        const mailOptions = {
            to: to,
            from: from,
            subject: subject,
            text: text,
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
   
}
export default BaseController;
