import * as express from 'express';
const router = express();
import CustomersController from './customer.controller';
const objCustomersCtrl = new CustomersController();

router.get('/get', (req, res) => {
    objCustomersCtrl.getAllCustomer(req.body, res, req);
});

router.post('/getById', (req, res) => {
    objCustomersCtrl.findById(req.body, res, req);
});

router.post('/findByDateRange', (req, res) => {
    objCustomersCtrl.findByDateRange(req.body, res, req);
});

router.post('/add', (req, res) => {
    objCustomersCtrl.addNewCustomer(req.body, res, req);
});

router.put('/update', (req, res) => {
    objCustomersCtrl.update(req.body, res, req);
});

router.delete('/delete', (req, res) => {
    objCustomersCtrl.delete(req.body, res, req);
});

export default router;

