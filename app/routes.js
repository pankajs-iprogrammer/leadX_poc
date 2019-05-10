// import CustomerController from './controller/customer.controller.js';
const CustomerController = require('./controller/customer.controller.js');
const objCustCtrl = new CustomerController();
module.exports = function(app) {
 
    // const customers = require('./controller/customer.controller.js');
 
    // Create a new Customer
    app.post('/api/customers', objCustCtrl.addNewCustomer);

    // Get all Customers by Date Range
    app.post('/api/customers/getByDateRange', objCustCtrl.findByDateRange);
 
    // Retrieve all Customer
    app.get('/api/customers', objCustCtrl.findAll);
    
    // Retrieve thru procedure
    app.get('/api/custProc', objCustCtrl.byProcedure);
 
    // Retrieve a single Customer by Id
    app.get('/api/customers/:customerId', objCustCtrl.findById);
 
    // Update a Customer with Id
    app.put('/api/customers/:customerId', objCustCtrl.update);
 
    // Delete a Customer with Id
    app.delete('/api/customers/:customerId', objCustCtrl.delete);
}
