module.exports = (sequelize, Sequelize) => {
  const Customer= sequelize.define('customer', {
    firstname: {
      type: Sequelize.STRING,      
    },
    lastname: {
      type: Sequelize.STRING,
      validate: {
        is: /^[a-z]+$/i,  // or isAlpha: true
        notEmpty: true,  
      }
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true,         
        notEmpty: true,  
      }
    },
    password: {
      type: Sequelize.STRING
    },
    salt: {
      type: Sequelize.STRING
    },
    contact: {
      type: Sequelize.STRING,
      validate :{
        isNumeric: true   
      }
    }
  });
  
  return Customer;
}