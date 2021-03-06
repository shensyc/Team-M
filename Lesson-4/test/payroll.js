var Payroll = artifacts.require("./Payroll.sol");

contract('Payroll_addEmployee', function(accounts) {

  it("Test other user  to add employee", function() {
    return Payroll.deployed().then(function(instance) {
      payrollInstance = instance;
      return payrollInstance.addEmployee(accounts[1], 2, {from: accounts[2]});
    }).catch( function(error) {
        assert.include(error.toString(),"revert", "Error!!: other user can add employee");
    });
  });

  it("Test add an exist employee", function() {
    return Payroll.deployed().then(function(instance) {
    payrollInstance = instance;
      return payrollInstance.addEmployee(accounts[1], 1, {from: accounts[0]});
    }).then( function() {
      return payrollInstance.addEmployee(accounts[1], 1, {from: accounts[0]});
    }).catch( function(error) {
      assert.include(error.toString(),"invalid opcode", "Error!!: Can add same employee");
    });
  });


  it("Test add an employee with 2 eth salary", function() {
    return Payroll.deployed().then(function(instance) {
      payrollInstance = instance;
      return payrollInstance.addEmployee(accounts[2], 2, {from: accounts[0]});
    }).then(function() {
      return payrollInstance.employees(accounts[2]);
    }).then(function(employee) {
      assert.equal(employee[1].toNumber(), web3.toWei(2, 'ether'), "Error!!: The salary was wrong!");
    });
  });

});

contract('Payroll_removeEmployee', function(accounts) {

  it("Test other user want to remove employee", function() {
    return Payroll.deployed().then(function(instance) {
      payrollInstance = instance;
      return payrollInstance.removeEmployee(accounts[1], {from: accounts[2]});
    }).catch( function(error) {
        assert.include(error.toString(),"revert", "Error!!: other user can remove employee");
    });
  });

  it("Test remove an not exist employee", function() {
    return Payroll.deployed().then(function(instance) {
      payrollInstance = instance;
      return payrollInstance.removeEmployee(accounts[5], {from: accounts[0]});
    }).catch( function(error) {
        assert.include(error.toString(),"invalid opcode", "Error!!: can remove not exist employee");
    });
  });


  it("Test remove an existing employee", function() {
    return Payroll.deployed().then( function(instance) {
      payrollInstance = instance;
      return payrollInstance.addFund({from: accounts[0],value: web3.toWei('3', 'ether')});
    }).then(function(){
      return payrollInstance.addEmployee(accounts[1], 1, {from: accounts[0]});
    }).then(function() {
      return payrollInstance.employees(accounts[1]);
    }).then(function(employee) {
      assert.equal(employee[1].toNumber(), web3.toWei(1, 'ether'), "Error!!: add employee failed!");
    }).then(function() {
      return payrollInstance.removeEmployee(accounts[1]);
    }).then(function() {
      return payrollInstance.employees(accounts[1]);
    }).then(function(employeeTwo) {
      assert.equal(employeeTwo[1].toNumber(), 0, "Error!!: remove employee failed!");
    });
  });

});
