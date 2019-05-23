import * as express from "express";
const router = express();
import ContactCompanyController from "./company.controller";
const ContactCompanyCtrl = new ContactCompanyController();

router.post("/add", (req, res) => {
    ContactCompanyCtrl.addNewContactCompany(req.body, res, req);
});

router.put("/update", (req, res) => {
    ContactCompanyCtrl.update(req.body, res);
});

router.delete("/delete", (req, res) => {
    ContactCompanyCtrl.delete(req.body, res);
});

router.post("/get", (req, res) => {
    ContactCompanyCtrl.getAllContactCompany(req.body, res);
});

router.post("/getOne", (req, res) => {
    ContactCompanyCtrl.getContactCompanyOne(req.body, res);
});

export default router;
