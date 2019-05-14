import * as express from 'express';
const router = express();

import customerRouter from './app/components/customer/customer.route';

router.use('/customer', customerRouter);

export default router;

