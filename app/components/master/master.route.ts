import * as express from "express";
const router = express();
import MasterController from "./master.controller";
const MasterCtrl = new MasterController();

router.post("/get", (req, res) => {
    MasterCtrl.getAllLeadStatus(req.body, res);
});

export default router;
