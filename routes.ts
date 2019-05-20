import * as express from 'express';
const router = express();

import salesNewsRouter from './app/components/salesNews/salesNews.route';
import customerRouter from './app/components/customer/customer.route';
import departmentRouter from './app/components/department/department.route';
import contactCompany from './app/components/contact.company/contact.company.route';

router.use('/salesNews', salesNewsRouter);
router.use('/customer', customerRouter);
router.use('/department', departmentRouter );
router.use('/contact/company', contactCompany );

export default router;

