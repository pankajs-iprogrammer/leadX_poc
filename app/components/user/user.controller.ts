import * as Joi from "@hapi/joi";
import * as redis from "redis";
import * as crypto from "crypto";
import { CONSTANTS } from "../../config/constants";
import db from "../../config/db.config";
import BaseController from "../../shared/controller/BaseController";
import User from "./user.model";
import Department from "../department/department.model";

class UserController extends BaseController {
    public async addNewUser(reqBody, res: object) {
        /**************** Joi Validation Start ********************/
        let schema = Joi.object().keys({
            password: Joi.string()
                .regex(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
                )
                .min(8)
                .required()
        });
        const reqPass = {
            password: reqBody.password
        };
        Joi.validate(reqPass, schema, (err, value) => {
            if (err) {
                this.sendResponse(
                    res,
                    true,
                    CONSTANTS.SERVERERRORCODE,
                    err,
                    ""
                );
                return false;
            } else {
                console.log("there is no error");
            }
        });
        /**************** Joi Validation End ********************/

        const self = this;
        /****************** Password encryption start ******************/
        const plainTextPassword = reqBody.password;
        const passwordObj = await this.encryptPassword(plainTextPassword);

        reqBody.password = passwordObj.hash;
        reqBody.salt = passwordObj.salt;
        /****************** Password encryption end ********************/

        User.create(reqBody)
            .then(user => {
                self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, user, "");
            })
            .catch(function(err) {
                self.sendResponse(
                    res,
                    true,
                    CONSTANTS.SERVERERRORCODE,
                    err,
                    ""
                );
            });
    }

    public async findByDateRange(reqBody, res: object) {
        /**************** Joi Validation Start ********************/
        const schema = Joi.object().keys({
            startDate: Joi.date()
                .iso()
                .required(),
            endDate: Joi.date()
                .iso()
                .min(Joi.ref("startDate"))
                .required()
        });
        Joi.validate(reqBody, schema, (err, value) => {
            if (err) {
                this.sendResponse(
                    res,
                    true,
                    CONSTANTS.SERVERERRORCODE,
                    err,
                    ""
                );
            } else {
                console.log("there is no error");
            }
        });
        /**************** Joi Validation End ********************/
        User.findAll().then(users => {
            // Send all users to Client
            this.sendResponse(res, true, CONSTANTS.SUCCESSCODE, users, "");
        });
    }

    public async getAllUser(reqBody, res: object) {
        const self = this;
        const client = redis.createClient();
        let userData = [];
        /* Checking whether data exist in redis or not */
        client.get("users", function(err, data) {
            if (data) {
                const users = JSON.parse(data);
                userData = [
                    { msg: "Response is coming from Redis", data: users }
                ];
                self.sendResponse(
                    res,
                    true,
                    CONSTANTS.SUCCESSCODE,
                    userData,
                    ""
                );
            } else {
                User.findAll({
                    // include : [{
                    //         model : Department ,
                    //        as : 'DepartmentRef'
                    //       }]
                }).then(users => {
                    /* Storing response in Redis */
                    client.set("users", JSON.stringify(users));
                    userData = [
                        { msg: "Response is coming from DB", data: users }
                    ];
                    self.sendResponse(
                        res,
                        true,
                        CONSTANTS.SUCCESSCODE,
                        userData,
                        ""
                    );
                });
            }
        });
    }

    public async encryptPassword(plainTextPassword, salt = "") {
        const pass = plainTextPassword;
        const iterations = CONSTANTS.THOUSAND;
        const keylen = CONSTANTS.SIXTYFOUR;
        salt =
            salt == ""
                ? crypto.randomBytes(CONSTANTS.SIXTEEN).toString("hex")
                : salt;
        const hash = crypto
            .pbkdf2Sync(pass, salt, iterations, keylen, `sha512`)
            .toString(`hex`);
        const passObj = {
            salt,
            hash
        };
        return passObj;
    }

    public async verifyPassword(password, salt) {
        // extract the salt and hash from the combined buffer
        var saltBytes = CONSTANTS.SIXTEEN;
        var hashBytes = CONSTANTS.SIXTYFOUR;
        var iterations = CONSTANTS.THOUSAND;
        var salt = salt;
        var hash = password;

        // verify the salt and hash against the password
        crypto.pbkdf2(password, salt, iterations, hashBytes, "sha512", function(
            err,
            verify
        ) {
            if (err) {
                console.log(err);
            }
            console.log(verify.toString(`hex`));
        });
    }

    public async byProcedure(reqBody, res: object) {
        db.sObj.query("CALL GetAllUsers;").then(users => {
            this.sendResponse(res, true, CONSTANTS.SUCCESSCODE, users, "");
        });
    }

    public async findById(reqBody, res: object) {
        User.findById(reqBody.userId).then(user => {
            this.sendResponse(res, true, CONSTANTS.SUCCESSCODE, user, "");
        });
    }

    public async update(reqBody, res: object) {
        const id = reqBody.userId;

        User.update(reqBody, { where: { id: reqBody.userId } }).then(() => {
            this.sendResponse(
                res,
                true,
                CONSTANTS.SUCCESSCODE,
                "updated successfully a user with id = " + id,
                ""
            );
        });
    }

    public async delete(reqBody, res: object) {
        const id = reqBody.userId;
        User.destroy({
            where: { id: id }
        }).then(() => {
            this.sendResponse(
                res,
                true,
                CONSTANTS.SUCCESSCODE,
                "deleted successfully a user with id = " + id,
                ""
            );
        });
    }
}

export default UserController;
