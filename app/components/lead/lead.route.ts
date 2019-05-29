import * as express from "express";
const router = express();
import LeadController from "./lead.controller";
const LeadCtrl = new LeadController();

router.post("/add", (req, res) => {
    LeadCtrl.addNewLead(req.body, res, req);
});

router.put("/update", (req, res) => {
    LeadCtrl.updateLead(req.body, res, req);
});

router.post("/getList", (req, res) => {
    LeadCtrl.getAllLeadList({ reqBody: req.body, res });
});

router.post("/getOne", (req, res) => {
    LeadCtrl.getLeadOne(req.body, res);
});

router.post("/revenueTotal", (req, res) => {
    LeadCtrl.getRevenueTotal(req.body, res, req);
});

export default router;
