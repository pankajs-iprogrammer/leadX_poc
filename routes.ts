import * as express from "express";
const router = express();

import loginRouter from "./app/components/login/login.route";
import userRouter from "./app/components/user/user.route";
import salesNewsRouter from "./app/components/salesNews/salesNews.route";
import customerRouter from "./app/components/customer/customer.route";
import departmentRouter from "./app/components/department/department.route";
import contactCompany from "./app/components/contact/contact.company/contact.company.route";
import contactPerson from "./app/components/contact/contact.person/contact.person.route";

router.use("/salesNews", salesNewsRouter);
router.use("/customer", customerRouter);
router.use("/department", departmentRouter);
router.use("/contact/company", contactCompany);
router.use("/contact/person", contactPerson);

router.use("/login", loginRouter);
router.use("/user", userRouter);

export default router;
