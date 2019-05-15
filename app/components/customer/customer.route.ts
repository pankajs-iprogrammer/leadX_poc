import * as express from 'express';
const router = express();
import CustomersController from './customer.controller';
const objCustomersCtrl = new CustomersController();

router.get('/get', (req, res) => {
    objCustomersCtrl.getAllCustomer(req.body, res);
});

router.post('/getById', (req, res) => {
    objCustomersCtrl.findById(req.body, res);
});

router.post('/findByDateRange', (req, res) => {
    objCustomersCtrl.findByDateRange(req.body, res);
});

router.post('/add', (req, res) => {
    objCustomersCtrl.addNewCustomer(req.body, res);
});

router.put('/update', (req, res) => {
    objCustomersCtrl.update(req.body, res);
});

router.delete('/delete', (req, res) => {
    objCustomersCtrl.delete(req.body, res);
});

export default router;

