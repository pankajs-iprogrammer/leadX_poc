import * as express from "express";
const router = express();
import MasterController from "./master.controller";
const MasterCtrl = new MasterController();

router.post("/getMstLeadStatus", (req, res) => {
    MasterCtrl.getAllLeadStatus({ reqBody: req.body, res });
});

router.post("/getMstActivityType", (req, res) => {
    MasterCtrl.getAllActivityType({ reqBody: req.body, res });
});

router.post("/getMstCurrency", (req, res) => {
    MasterCtrl.getAllCurrency({ reqBody: req.body, res });
});

router.post("/getMstLeadSource", (req, res) => {
    MasterCtrl.getAllLeadSource({ reqBody: req.body, res });
});
router.post("/territory/country", (req, res) => {
    MasterCtrl.getAllCountry({ reqBody: req.body, res });
});
router.post("/territory/country/state", (req, res) => {
    MasterCtrl.getAllStateOfThisCountry({ reqBody: req.body, res });
});
router.post("/territory/country/state/city", (req, res) => {
    MasterCtrl.getAllCityOfThisState({ reqBody: req.body, res });
});
router.post("/getRoles", (req, res) => {
    MasterCtrl.getAllRoles({ reqBody: req.body, res });
});
router.post("/getLicenseType", (req, res) => {
    MasterCtrl.getAlllicenseType({ reqBody: req.body, res });
});
router.post("/getMasters", (req, res) => {
    MasterCtrl.getMasters({ reqBody: req.body, res });
});
export default router;
