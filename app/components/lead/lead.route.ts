import * as express from "express";
const router = express();
import LeadController from "./lead.controller";
const LeadCtrl = new LeadController();

router.post("/add", (req, res) => {
    LeadCtrl.addNewLead(req.body, res);
});

router.put("/update", (req, res) => {
    LeadCtrl.updateLead(req.body, res);
});

router.post("/get", (req, res) => {
    LeadCtrl.getAllLeadList(req.body, res);
});

router.post("/getOne", (req, res) => {
    LeadCtrl.getLeadOne(req.body, res);
});

export default router;
