import * as express from "express";
const router = express();
import LoginController from "./login.controller";
var passport = require("../../config/passport");
const objLoginCtrl = new LoginController();

router.post("/", (req, res) => {
    console.log("++++ checkLogin +++++");
    objLoginCtrl.checkLogin(req, res);
});

export default router;
