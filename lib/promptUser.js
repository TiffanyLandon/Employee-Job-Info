const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('../../db/connection.js');
const cTable = require('console.table');


function firstPrompt() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'userChoice',
            message: 'What would you like to do?',
            choices: [
                'View All employees',
                'View employees By Department',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Add Role',
                'Add Department',
                'Exit'
            ]

        }

    ]).then((res) => {
        console.log(res.userChoice);
        switch (res.userChoice) {
            case 'View All employees':
                viewAllemployees();
                break;
            case 'View employees By roles':
                viewemployeesByDepartment();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Remove Employee':
                removeEmployee();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Exit':
                connection.end();
                break;
        }

    }).catch((err) => {
        if (err) throw err;
    });
}

// employees

function viewAllemployees() {
    let query =
        `SELECT 
          employees.id, 
          employees.first_name, 
          employees.last_name, 
          roles.title, 
          departments.name AS departments, 
          roles.salary, 
          CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employees
      LEFT JOIN roles
          ON employeex.role_id = role.id
      LEFT JOIN departments
          ON departments.id = roles.departments_id
      LEFT JOIN employees manager
          ON manager.id = employees.manager_id`

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        firstPrompt();
    });
}

//VIEW employees BY DEPARTMENT
function viewemployeesByDepartment() {
    let query =
        `SELECT 
          departments.id, 
          departments.name, 
          roles.salary
      FROM employees
      LEFT JOIN roles 
          ON employees.roles_id = roles.id
      LEFT JOIN department
          ON departments.id = roles.departments_id
      GROUP BY departments.id, departments.name, roles.salary`;

    connection.query(query, (err, res) => {
        if (err) throw err;
        const deptChoices = res.map((choices) => ({
            value: choices.id, name: choices.name
        }));
        console.table(res);
        getDept(deptChoices);
    });
}
//GET DEPARTMENT
function getDept(deptChoices) {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Departments: ',
                choices: deptChoices
            }
        ]).then((res) => {
            let query = `SELECT 
                          employees.id, 
                          employees.first_name, 
                          employees.last_name, 
                          roles.title, 
                          departments.name
                      FROM employees
                      JOIN roles
                          ON employees.roles_id = roles.id
                      JOIN departments
                          ON departments.id = roles.departments_id
                      WHERE departments.id = ?`

            connection.query(query, res.department, (err, res) => {
                if (err) throw err;
                firstPrompt();
                console.table(res);
            });
        })
}

//ADD AN EMPLOYEE
function addEmployee() {
    let query =
        `SELECT 
          roles.id, 
          roles.title, 
          roles.salary 
      FROM roles`

    connection.query(query, (err, res) => {
        if (err) throw err;
        const role = res.map(({ id, title, salary }) => ({
            value: id,
            title: `${title}`,
            salary: `${salary}`
        }));

        console.table(res);
        employeeRoles(role);
    });
}

function employeesRoles(role) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "firstName",
                message: "Employee First Name: "
            },
            {
                type: "input",
                name: "lastName",
                message: "Employee Last Name: "
            },
            {
                type: "list",
                name: "roleId",
                message: "Employee Role: ",
                choices: role
            }
        ]).then((res) => {
            let query = `INSERT INTO employees SET ?`
            connection.query(query, {
                first_name: res.firstName,
                last_name: res.lastName,
                role_id: res.roleId
            }, (err, res) => {
                if (err) throw err;
                firstPrompt();
            });
        });
}

//REMOVE EMPLOYEE
function removeemployees() {
    let query =
        `SELECT
        employees.id, 
        employees.first_name, 
        employees.last_name
    FROM employees`

    connection.query(query, (err, res) => {
        if (err) throw err;
        const employee = res.map(({ id, first_name, last_name }) => ({
            value: id,
            name: `${id} ${first_name} ${last_name}`
        }));
        console.table(res);
        getDelete(employee);
    });
}

function getDelete(employee) {
    inquirer
        .prompt([
            {
                type: "list",
                name: "employee",
                message: "Employee To Be Deleted: ",
                choices: employee
            }
        ]).then((res) => {
            let query = `DELETE FROM employees WHERE ?`;
            connection.query(query, { id: res.employee }, (err, res) => {
                if (err) throw err;
                firstPrompt();
            });
        });
}

//UPDATE EMPLOYEE ROLE
function updateEmployeeRole() {
    let query = `SELECT 
                      employees.id,
                      employees.first_name, 
                      employees.last_name, 
                      roles.title, 
                      departments.name, 
                      roles.salary, 
                      CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                  FROM employees
                  JOIN role
                      ON employee.role_id = role.id
                  JOIN department
                      ON department.id = role.department_id
                  JOIN employee manager
                      ON manager.id = employee.manager_id`

    connection.query(query, (err, res) => {
        if (err) throw err;
        const employees = res.map(({ id, first_name, last_name }) => ({
            value: id,
            name: `${first_name} ${last_name}`
        }));
        console.table(res);
        updateRole(employees);
    });
}

function updateRole(employees) {
    let query =
        `SELECT 
      roles.id, 
      roles.title, 
      roles.salary 
    FROM roles`

    connection.query(query, (err, res) => {
        if (err) throw err;
        let roleChoices = res.map(({ id, title, salary }) => ({
            value: id,
            title: `${title}`,
            salary: `${salary}`
        }));
        console.table(res);
        getUpdatedRoles(employees, rolesChoices);
    });
}

function getUpdatedRole(employees, rolesChoices) {
    inquirer
        .prompt([
            {
                type: "list",
                name: "employee",
                message: `Employee who's role will be Updated: `,
                choices: employee
            },
            {
                type: "list",
                name: "role",
                message: "Select New Role: ",
                choices: rolesChoices
            },

        ]).then((res) => {
            let query = `UPDATE employee SET role_id = ? WHERE id = ?`
            connections.query(query, [res.role, res.employee], (err, res) => {
                if (err) throw err;
                firstPrompt();
            });
        });
}

//ADD ROLE
function addRoles() {
    var query =
        `SELECT 
        departments.id, 
        departments.name, 
        roles.salary
      FROM employees
      JOIN roles
        ON employees.roles_id = roles.id
      JOIN departments
        ON departments.id = roles.departments_id
      GROUP BY departments.id, departments.name`

    connection.query(query, (err, res) => {
        if (err) throw err;
        const department = res.map(({ id, name }) => ({
            value: id,
            name: `${id} ${name}`
        }));
        console.table(res);
        addToRole(department);
    });
}

function addToRole(department) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "title",
                message: "Role title: "
            },
            {
                type: "input",
                name: "salary",
                message: "Role Salary: "
            },
            {
                type: "list",
                name: "department",
                message: "Department: ",
                choices: department
            },
        ]).then((res) => {
            let query = `INSERT INTO roles SET ?`;

            connection.query(query, {
                title: res.title,
                salary: res.salary,
                department_id: res.department
            }, (err, res) => {
                if (err) throw err;
                firstPrompt();
            });
        });
}

//ADD DEPARTMENT
function addDepartment() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "name",
                message: "Department Name: "
            }
        ]).then((res) => {
            let query = `INSERT INTO department SET ?`;
            connection.query(query, { name: res.name }, (err, res) => {
                if (err) throw err;
                //console.log(res);
                firstPrompt();
            });
        });
}