
// class - for database or database access object
//  1. constructor - takes in database connection as input parameter and assign it to the instant variable
  const connection = require("./connection");
//  2. method - find all employees, join with roles and departments to display their roles, salaries, departments, and managers
  class employeeDatabase {
    constructor(connection) {
      this.connection = connection;
    }
    findAllEmployees() {
      return this.connection.promise().query(`SELECT employee.id AS 'Employee ID',
      CONCAT(employee.first_name, ' ', employee.last_name) AS 'Employee Name',
      role.title AS Role, department.name AS Department, role.salary AS Salary, 
      CONCAT(e.first_name, ' ',e.last_name) AS Manager
      FROM employee
      INNER JOIN role ON role.id = employee.role_id
      INNER JOIN department ON department.id = role.department_id
      LEFT JOIN employee e ON employee.manager_id = e.id
      ORDER BY employee.id ASC;`
      );
    }

//  3. method - create a new employee - takes employee object as input parameter
//  4. method - update employee's role - takes employee id and role id as input parameters
    updateEmployeeRole(employeeId, roleId) {
      return this.connection.promise().query(
        "UPDATE employee SET role_id = ? WHERE id = ?",
        [roleId, employeeId]
      );
    }
//  5. method - find all roles - join with departments to diplay department names
    findAllRoles() {
      return this.connection.promise().query(
        "SELECT role.id AS 'Role ID', role.title AS 'Role Title', department.name AS Department, role.salary AS Salary FROM role LEFT JOIN department ON role.department_id = department.id;"
      );
    }
//  6. method - create a new role - takes in role object as input parameter
    // createRole({role}) {
    //   return this.connection.promise().query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);", role);
    // }

//  7. method - find all departments
    findAllDepartments() {
      return this.connection.promise().query(
        "SELECT department.id AS 'Department ID', department.name AS 'Department Name' FROM department;"
      );
    }
//  8. method - create a new department - takes in department object as input parameter
    createDepartment(department) {
      return this.connection.promise().query("INSERT INTO department (name) VALUES (?)", department);
    }
  };

// export the class
  module.exports = new employeeDatabase(connection);