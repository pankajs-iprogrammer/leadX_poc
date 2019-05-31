import * as Joi from "@hapi/joi";
import * as redis from "redis";
import * as crypto from "crypto";
import { CONSTANTS } from "../../config/constants";
import BaseController from "../../shared/controller/BaseController";
import User from "./user.model";
import RoleModel from "../master/role.model";

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
        var hashBytes = CONSTANTS.SIXTYFOUR;
        var iterations = CONSTANTS.THOUSAND;

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

    public async getUserById(userId) {
        const includeObj = [
            {
                model: RoleModel,
                attributes: ["id", "actual_name", "display_name"]
            }
        ];
        let condition = {
            where: { id: userId },
            attributes: ["id", "name", "email", "user_avatar"],
            include: includeObj
        };
        const leadData = await this.getOne(User, condition);
        return leadData["data"];
    }

    public async getUserList(reqBody, res: object) {
        const condition = {
            where: {
                user_role_id: {
                    $gt: 1
                }
            },
            attributes: ["id", "name"]
        };
        const contact_person = await this.getAll(User, condition);
        this.sendResponse(
            res,
            true,
            CONSTANTS.SUCCESSCODE,
            contact_person["data"],
            ""
        );
    }
}

export default UserController;
