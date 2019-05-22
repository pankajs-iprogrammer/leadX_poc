import * as express from "express";
const router = express();
import LoginController from "./login.controller";
var passport = require("../../config/passport");
const objLoginCtrl = new LoginController();

router.post("/checkLogin/", (req, res) => {
    objLoginCtrl.checkLogin(req, res);
});

router.get("/logout/", (req, res) => {
    console.log("++++++ User is logged in ++++++");
    objLoginCtrl.logout(req, res);
});

export default router;
