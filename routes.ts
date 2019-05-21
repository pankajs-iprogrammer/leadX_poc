import * as express from "express";
const router = express();

import loginRouter from "./app/components/login/login.route";

import customerRouter from "./app/components/customer/customer.route";
import departmentRouter from "./app/components/department/department.route";
import contactCompany from "./app/components/contact.company/contact.company.route";
import userRouter from "./app/components/user/user.route";

router.use("/login", loginRouter);
router.use("/customer", customerRouter);
router.use("/user", customerRouter);
router.use("/department", departmentRouter);
router.use("/user", userRouter);
router.use("/contact/company", contactCompany);

export default router;
