import * as express from 'express';
const router = express();
import ContactCompanyController from './contact.company.controller';
const ContactCompanyCtrl = new ContactCompanyController();

router.get('/get', (req, res) => {
    ContactCompanyCtrl.getAllContactCompany(req.body, res);
});

router.post('/getById', (req, res) => {
    ContactCompanyCtrl.findById(req.body, res);
});

router.post('/findByDateRange', (req, res) => {
    ContactCompanyCtrl.findByDateRange(req.body, res);
});

router.post('/add', (req, res) => {
    ContactCompanyCtrl.addNewContactCompany(req.body, res);
});

router.put('/update', (req, res) => {
    ContactCompanyCtrl.update(req.body, res);
});

router.delete('/delete', (req, res) => {
    ContactCompanyCtrl.delete(req.body, res);
});
export default router;
