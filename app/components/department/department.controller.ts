import * as redis from 'redis';
import { CONSTANTS }  from '../../config/constants';
import BaseController from '../../shared/controller/BaseController';
import Department from './department.model';
import Customer from '../customer/customer.model'

// Customer.init({
  
// }, {
//   underscored: true,
//   "sequelize": Department.sequelize,
//   modelName: 'customer'
// });

class DepartmentController extends BaseController {

  public async getAllDepartment(reqBody, res) {
    const self = this;
    const client = redis.createClient();
    let DepartmentData = [];
    /* Checking whether data exist in redis or not */
    client.get("Departments", function (err, data) {
      if (data) {
        const Departments = JSON.parse(data);
        DepartmentData = [{ "msg": "Response is coming from Redis", "data": Departments }];
        self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, DepartmentData, '');
      }
      else {
        Department.findAll({
          include : [{
                      model : Customer
                    }]
        }).then(Departments => {
          /* Storing response in Redis */
          client.set('Departments', JSON.stringify(Departments));
          DepartmentData = [{ "msg": "Response is coming from DB", "data": Departments }];
          self.sendResponse(res, true, CONSTANTS.SUCCESSCODE, DepartmentData, '');
        });
      }
    })
  };
}

export default DepartmentController;
