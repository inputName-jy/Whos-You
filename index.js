// Import inquirer
const inquirer = require("inquirer");
// Optional: import asciiart-logo
const logo = require("asciiart-logo");
// import your database module
const db = require("./db/index");
const dbq = require("./db/connection");
// Import console table for logging information on screen in table format
require("console.table");

// Call startup function
init();
// (async function init(){
//   await loadPrompts();
// })();

// middleware
function cap(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}



// function: start up
async function init() {
  //    optional: display logo text using asciiart-logo
  const logoText = logo({ name: "Employee Tracker" }).render();

  console.log(logoText);

  //    call function to the main prompt for questions
  await loadMainPrompts();
}

// function - main prompt for questions
function loadMainPrompts() {
  // - Prompt with the list of choices
  inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "What do you want to see?",
      choices: [
        {
          name: "View all employees",
          value: "VIEW_ALL_EMPLOYEES"
        },
        {
          name: "View all roles",
          value: "VIEW_ALL_ROLES"
        },
        {
          name: "View all departments",
          value: "VIEW_ALL_DEPARTMENTS"
        },
        {
          name: "Add an employee",
          value: "ADD_EMPLOYEE"
        },
        {
          name: "Add a role",
          value: "ADD_ROLE"
        },
        {
          name: "Add a department",
          value: "ADD_DEPARTMENT"
        },
        {
          name: "Update an employee's role",
          value: "UPDATE_EMPLOYEE_ROLE"
        },
        {
          name: "Exit",
          value: "EXIT"
        }
      ]
    }
  ]).then(res => {
    // Call the appropriate function depending on what the user chose
    switch (res.choice) {
      case "VIEW_ALL_DEPARTMENTS":
        findAllDepartments()
        break;
      case "VIEW_ALL_ROLES":
        findAllRoles()
        break;
      case "VIEW_ALL_EMPLOYEES":
        findAllEmployees()
        break;
      case "ADD_DEPARTMENT":
        createDepartment()
        break;
      case "ADD_ROLE":
        createRole()
        break;
      case "ADD_EMPLOYEE":
        createEmployee()
        break;
      case "UPDATE_EMPLOYEE_ROLE":
        updateEmployeeRole()
        break;
      case "EXIT":
        exit();
        break;
    }
  })
};


// function - View all employees
async function findAllDepartments() {
  // 1. call find all employees method on database object
  await db.findAllDepartments()
    //    in .then callback, display returned data with console table method
    .then((dbResults) => {
      const [rows] = dbResults;
      let departments = rows;
      console.log('\n');
      console.table(departments);
    })
    .then(() => loadMainPrompts());
};

// function - View all roles
async function findAllRoles() {
  // 1. call find all roles method on database object
  await db.findAllRoles()
    //    in .then callback, display returned data with console table method
    .then((dbResults) => {
      const [rows] = dbResults;
      let roles = rows;
      console.log('\n');
      console.table(roles);
    })
    .then(() => loadMainPrompts());
};

// function - View all deparments
async function findAllEmployees() {
  await db.findAllEmployees()
    .then((dbResults) => {
      const [rows] = dbResults;
      let roles = rows;
      console.log('\n');
      console.table(roles);
    })
    .then(() => loadMainPrompts());
};


// Add a department
async function createDepartment() {
  //  1. prompt user for the name of the department
  inquirer.prompt([
    {
      type: "input",
      name: "dept_name",
      message: "What is the name of the new department?"
    }
  ])
    //      in .then callback, call create department method on database object, passing the returned data as input argument
    //  2. call function to load main prompt for questions
    .then((res) => {
      let dept_name = res.dept_name;
      let cap_dept_name = cap(dept_name);
      db.createDepartment(cap_dept_name)
        .then(() => console.log(`Added ${dept_name} to the database`))
        .then(() => loadMainPrompts())
    })
};

async function createRole() {
  inquirer.prompt([
    {
      type: "input",
      name: "role_title",
      message: "What is the title of the role?"
    },
    {
      type: "input",
      name: "role_salary",
      message: "What is the salary of the role?"
    },
  ]).then(res => {
    const title = cap(res.role_title);
    const salary = res.role_salary;
    dbq.promise().query("SELECT * FROM department").then(([rows]) => {
      let departments = rows;
      const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
      }));
      inquirer.prompt([
        {
          type: "list",
          name: "department_id",
          message: "What department does this role belong to?",
          choices: departmentChoices
        }
      ]).then(res => {
        dbq.promise().query("INSERT INTO role (title, salary, department_id) VALUES (?,?,?)", [title, salary, res.department_id])
          .then(() => console.log(`Added ${title} to the database`))
          .then(() => loadMainPrompts())
      })
    })
  })
}

async function createEmployee() {
  inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "What is the first name of the employee?",
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the last name of the employee?",
    },
  ]).then(res => {
    let first_name = cap(res.first_name);
    let last_name = cap(res.last_name);
    dbq.promise().query("SELECT * FROM role").then(([rows]) => {
      let roles = rows;
      const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
        }));
        inquirer.prompt([
          {
            type: "list",
            name: "role_id",
            message: "What is the role of the employee?",
            choices: roleChoices
          }
        ]).then(res => {
          let role_id = res.role_id;
          dbq.promise().query("SELECT * FROM employee").then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
              name: `${first_name} ${last_name}`,
              value: id
            }));
            employeeChoices.unshift({ name: "None", value: null });
            inquirer.prompt([
              {
                type: "list",
                name: "manager_id",
                message: "Who is the manager of the employee?",
                choices: employeeChoices
              }
            ]).then(res => {
              let manager_id = res.manager_id;
              dbq.promise().query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)", [first_name, last_name, role_id, manager_id])
              .then(() => {
                console.log("Employee added!");
              }).then(() => loadMainPrompts());
            })
          }
          )

  })
})
})
};




// function - Update an employee's role
// async function updateEmployeeRole() {
//   inquirer.prompt([
//     {
//       type: "input",
//       name: "id",
//       message: "What is the id of the employee?",
//     },
//     {
//       type: "input",
//       name: "role_id",
//       message: "What is the new role id of the employee?",
//     }
//   ]).then(res => {
//     dbq.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [res.role_id, res.id])
//   })
//     .then(() => {
//       console.log("Employee updated!");
//       loadMainPrompts();
//     }
//     )
// }

async function updateEmployeeRole() {
  dbq.promise().query("SELECT * FROM employee").then(([rows]) => {
    let employees = rows;
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }));
    inquirer.prompt([
      {
        type: "list",
        name: "employee_id",
        message: "Which employee's role do you want to update?",
        choices: employeeChoices
      }
    ]).then(res => {
      let employee_id = res.employee_id;
      dbq.promise().query("SELECT * FROM role").then(([rows]) => {
        let roles = rows;
        const roleChoices = roles.map(({ id, title }) => ({
          name: title,
          value: id
        }));
        inquirer.prompt([
          {
            type: "list",
            name: "role_id",
            message: "What is the new role of the employee?",
            choices: roleChoices
          }
        ]).then(res => {
          let role_id = res.role_id;
          dbq.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [role_id, employee_id])
            .then(() => {
              console.log("Employee updated!");
              loadMainPrompts();
            })
        })
      })
    })
  })
}


// function - Exit the application
function exit() {
  console.log("Goodbye!");
  process.exit();
};
