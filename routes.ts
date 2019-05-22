import * as express from "express";
const router = express();

import loginRouter from "./app/components/login/login.route";
import userRouter from "./app/components/user/user.route";
import salesNewsRouter from "./app/components/salesNews/salesNews.route";
import customerRouter from "./app/components/customer/customer.route";
import departmentRouter from "./app/components/department/department.route";
import contactCompany from "./app/components/contact/company.route";
import contactPerson from "./app/components/contact/person.route";
import SalesFeed from "./app/components/salesFeed/salesFeed.route";

router.use("/login", loginRouter);
console.log(": Session Email : ");
router.use(function(req, res, next) {
    console.log(": Session Email : ", req.session.email);
    if (req.session.email) {
        next();
    } else {
        let resonse = {
            status: "Failure",
            statusCode: 403,
            data: "",
            errorMessage: "Unauthorized Access"
        };
        res.json(resonse);
    }
});

router.use("/salesNews", salesNewsRouter);
router.use("/customer", customerRouter);
router.use("/department", departmentRouter);
router.use("/contact/company", contactCompany);
router.use("/contact/person", contactPerson);
router.use("/salesFeed", SalesFeed);
router.use("/user", userRouter);

export default router;
