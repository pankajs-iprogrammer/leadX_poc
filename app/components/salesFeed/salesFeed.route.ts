import * as express from "express";
const router = express();
import SalesFeedController from "./salesFeed.controller";
const SalesFeedCtrl = new SalesFeedController();

router.post("/get", (req, res) => {
    SalesFeedCtrl.getAllSalesFeed(req.body, res);
});

export default router;
