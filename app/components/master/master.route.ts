import * as express from "express";
const router = express();
import MasterController from "./master.controller";
const MasterCtrl = new MasterController();

router.post("/getMstLeadStatus", (req, res) => {
    MasterCtrl.getAllLeadStatus({ reqBody: req.body, res });
});

router.post("/getMstCurrency", (req, res) => {
    MasterCtrl.getAllCurrency({ reqBody: req.body, res });
});

router.post("/getMstLeadSource", (req, res) => {
    MasterCtrl.getAllLeadSource({ reqBody: req.body, res });
});

export default router;
