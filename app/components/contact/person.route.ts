import * as express from "express";
const router = express();
import ContaPersonController from "./person.controller";
const ContactPersonCtrl = new ContaPersonController();

router.get("/get", (req, res) => {
    ContactPersonCtrl.getAllContactPerson(req.body, res);
});

router.post("/getOne", (req, res) => {
    ContactPersonCtrl.getContactPersonOne(req.body, res);
});

router.post("/findByDateRange", (req, res) => {
    ContactPersonCtrl.findByDateRange(req.body, res);
});

router.post("/add", (req, res) => {
    ContactPersonCtrl.addNewContactPerson(req.body, res);
});

router.put("/update", (req, res) => {
    ContactPersonCtrl.update(req.body, res);
});

router.delete("/delete", (req, res) => {
    ContactPersonCtrl.delete(req.body, res);
});
export default router;