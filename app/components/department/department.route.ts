import * as express from 'express';
const router = express();
import DepartmentsController from './department.controller';
const objDepartmentsCtrl = new DepartmentsController();

router.get('/get', (req, res) => {
    objDepartmentsCtrl.getAllDepartment(req.body, res, req);
});

// router.post('/getById', (req, res) => {
//     objDepartmentsCtrl.findById(req.body, res, req);
// });

// router.post('/findByDateRange', (req, res) => {
//     objDepartmentsCtrl.findByDateRange(req.body, res, req);
// });

// router.post('/add', (req, res) => {
//     objDepartmentsCtrl.addNewDepartments(req.body, res, req);
// });

// router.put('/update', (req, res) => {
//     objDepartmentsCtrl.update(req.body, res, req);
// });

// router.delete('/delete', (req, res) => {
//     objDepartmentsCtrl.delete(req.body, res, req);
// });


export default router;