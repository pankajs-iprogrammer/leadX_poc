import * as Joi from "@hapi/joi";
import * as crypto from "crypto";
import { CONSTANTS } from "../../config/constants";
import UserController from "../user/user.controller";
import BaseController from "../../shared/controller/BaseController";
import RoleModel from "../master/role.model";
import UserModal from "../user/user.model";
import LicenseTypeModal from "../master/licenseType.model";
import User from "../user/user.model";

const userCtrlObj = new UserController();

class LoginController extends BaseController {
    public async checkLogin(req, res: object) {
        let reqBody = req.body;
        console.log("++++++ session email +++++", req.session.email);
        /**************** Joi Validation Start ********************/
        const schema = Joi.object().keys({
            username: Joi.required(),
            password: Joi.required()
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

        let user = await this.getUserByEmail(reqBody["username"]);
        console.log("++++ user ++++", user);
        let encryptedPasswordObj = await userCtrlObj.encryptPassword(
            reqBody["password"],
            user["salt"]
        );

        if (encryptedPasswordObj["hash"] === user["password"]) {
            req.session.email = reqBody["username"];
            req.session.account_id = user["account_id"];
            req.session.user_id = user["id"];
            delete user["password"];
            delete user["salt"];
            this.sendResponse(res, true, CONSTANTS.SUCCESSCODE, user, "");
        } else {
            this.sendResponse(
                res,
                true,
                CONSTANTS.SERVERERRORCODE,
                [],
                "Wrong Username or Password"
            );
        }

        // Send all users to Client
    }

    logout(req, res) {
        let sessionData = req.session;
        let msg;
        let self = this;
        sessionData.destroy(function(err) {
            if (err) {
                msg = "Error destroying session";
                self.sendResponse(
                    res,
                    true,
                    CONSTANTS.SERVERERRORCODE,
                    err,
                    msg
                );
            } else {
                msg = "Session destroy successfully";
                self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, err, msg);
            }
        });
        // self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, "Testing", "");
    }

    async getUserByEmail(email) {
        const includeObj = [
            {
                model: RoleModel,
                attributes: ["id", "actual_name", "display_name"]
            },
            {
                model: LicenseTypeModal,
                attributes: ["id", "actual_name", "display_name"]
            }
        ];
        let condition = {
            where: { email: email },
            include: includeObj
        };
        const leadData = await this.getOne(UserModal, condition);
        return leadData["data"];
    }
}

export default LoginController;
