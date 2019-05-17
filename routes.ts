import * as express from 'express';
const router = express();

import customerRouter from './app/components/customer/customer.route';
import departmentRouter from './app/components/department/department.route';

router.use('/customer', customerRouter);
router.use('/department', departmentRouter )

export default router;

