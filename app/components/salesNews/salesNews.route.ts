import * as express from 'express';
const router = express();
import SalesNewsController from './salesNews.controller';
const SalesNewsCtrl = new SalesNewsController();

router.post('/add', (req, res) => {
    SalesNewsCtrl.addNewSalesNews(req.body, res);
});

router.put('/update', (req, res) => {
    SalesNewsCtrl.updateSalesNews(req.body, res);
});

router.delete('/delete', (req, res) => {
    SalesNewsCtrl.deleteSalesNews(req.body, res);
});

router.post('/get', (req, res) => {
    SalesNewsCtrl.allSalesNewsList(req.body, res);
});

export default router;
