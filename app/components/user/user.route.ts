import * as express from "express";
const router = express();
import UsersController from "./user.controller";
const objUsersCtrl = new UsersController();

router.get("/get", (req, res) => {
    objUsersCtrl.getAllUser(req.body, res);
});

router.post("/add", (req, res) => {
    objUsersCtrl.addNewUser(req.body, res);
});

router.put("/update", (req, res) => {
    objUsersCtrl.update(req.body, res);
});

router.delete("/delete", (req, res) => {
    objUsersCtrl.delete(req.body, res);
});

router.get("/getUserList", (req, res) => {
    objUsersCtrl.getUserList(req.body, res);
});

export default router;
