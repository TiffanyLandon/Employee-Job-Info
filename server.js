// Variable Definitions & Dependencies
const inquirer = require('inquirer');
const db = require('./db/connection');

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    toDo();
});

const validateDecimalInput = (input) => {
    if (!/^\d+$/.test(input)) {
        return "Please enter only numeric characters";
    } else {
        return true;
    }
};

function toDo() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "toDo",
                message: "What would you like to do?",
                choices: [
                    "View all departments",
                    "View all roles",
                    "View all employees",
                    "Add a department",
                    "Add a role",
                    "Add an employee",
                    "Update an employee role",
                    "Delete an employee",
                    "Want to exit",
                ],
            },
        ])
        .then((answers) => {
            switch (answers.toDo) {
                case "View all departments":
                    selectAllDepartments().then(([rows, fields]) => {
                        console.table(rows);
                        wantToExit();
                    });
                    break;
                case "View all roles":
                    selectAllRoles().then(([rows, fields]) => {
                        console.table(rows);
                        wantToExit();
                    });
                    break;
                case "View all employees":
                    selectAllEmployees().then(([rows, fields]) => {
                        console.table(rows);
                        wantToExit();
                    });
                    break;
                case "Add a department":
                    addDepartment();

                    break;
                case "Add a role":
                    addRole();

                    break;
                case "Add an employee":
                    addEmployee();

                    break;
                case "Update an employee role":
                    updateEmployee();

                    break;
                case "Delete an employee":
                    deleteEmployee();

                    break;
                default:
            }
        });
}
// view all departments
const selectAllDepartments = () => {
    return db.promise().execute("SELECT * FROM departments;");
};

// view all roles
const selectAllRoles = () => {
    return db.promise().execute("SELECT * FROM roles;");
};

//view all employees
const selectAllEmployees = () => {
    return db.promise().execute("SELECT * FROM employees;");
};

// add department to db
const addDepartment = () => {
    inquirer
        .prompt([
            {
                type: "input",
                name: "deptName",
                message: "What is the name of the department?",
            },
        ])
        .then((answers) => {
            const queryResults = db.query(
                `INSERT INTO departments (name) VALUES (?);`,
                answers.deptName,
                (err, results, fields) => {
                    if (err) {
                        console.log(
                            `There was an error adding ${answers.deptName} to the database!`
                        );
                    } else {
                        console.log(
                            `${answers.deptName} was added to the database with ID ${results.insertId}`
                        );
                    }
                }
            );
            wantToExit();
        })
        .catch((error) => {
            console.log(
                `There was an error adding ${answers.deptName} to the database!`
            );
        });
};

// add role to db
const addRole = () => {
    selectAllDepartments().then(([rows, fields]) => {
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "roleName",
                    message: "What is the name of the role?",
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is the salary of the role?",
                    validate: validateDecimalInput,
                },
                {
                    type: "list",
                    name: "deptRole",
                    message: "What department does the role belong to?",
                    choices: rows.map((r) => {
                        return { name: r.name, value: r.id };
                    }),
                },
            ])
            .then((answers) => {
                const queryResults = db.query(
                    `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);`,
                    [answers.roleName, answers.salary, answers.deptRole],
                    (err, results, fields) => {
                        if (err) {
                            console.log(
                                `There was an error adding ${answers.roleName} to the database!`
                            );
                        } else {
                            console.log(
                                `${answers.roleName} was added to the database with ID ${results.insertId}`
                            );
                        }
                    }
                );
                wantToExit();
            })
            .catch((error) => {
                console.log(
                    `There was an error adding ${answers.roleName} to the database!`
                );
            });
    });
};

// add an employee to db
const addEmployee = () => {
    Promise.all([selectAllRoles(), selectAllEmployees()]).then(
        ([roles, employees]) => {
            const [roleRows] = roles;
            const [employeeRows] = employees;

            inquirer
                .prompt([
                    {
                        type: "input",
                        name: "firstName",
                        message: "What is their first name?",
                    },
                    {
                        type: "input",
                        name: "lastName",
                        message: "What is their last name?",
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "What is their role?",
                        choices: roleRows.map((r) => {
                            return { name: r.title, value: r.id };
                        }),
                    },
                    {
                        type: "list",
                        name: "manager",
                        message: "Who is their manager?",
                        choices: employeeRows.map((r) => {
                            return { name: `${r.first_name} ${r.last_name}`, value: r.id };
                        }),
                    },
                ])
                .then((answers) => {
                    const queryResults = db.query(
                        `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`,
                        [
                            answers.firstName,
                            answers.lastName,
                            answers.role,
                            answers.manager,
                        ],
                        (err, results, fields) => {
                            if (err) {
                                console.log(
                                    `There was an error adding ${answers.firstName} to the database!`
                                );
                            } else {
                                console.log(
                                    `${answers.firstName} was added to the database with ID ${results.insertId}`
                                );
                            }
                        }
                    );
                    wantToExit();
                })
                .catch((error) => {
                    console.log(
                        "There was an error adding the employee to the database!"
                    );
                });
        }
    );
};

// update an employee
const updateEmployee = () => {
    Promise.all([selectAllRoles(), selectAllEmployees()]).then(
        ([roles, employees]) => {
            const [roleRows] = roles;
            const [employeeRows] = employees;

            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "name",
                        message: "Which employee's role do you want to update?",
                        choices: employeeRows.map((r) => {
                            return { name: `${r.first_name} ${r.last_name}`, value: r.id };
                        }),
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "What is the employee's role?",
                        choices: roleRows.map((r) => {
                            return { name: r.title, value: r.id };
                        }),
                    },
                ])
                .then((answers) => {
                    const queryResults = db.query(
                        `UPDATE employees
                    SET role_id = ${answers.role}
                    WHERE id = ${answers.name};`,
                        (err, results, fields) => {
                            if (err) {
                                console.log(`There was an error updating ${answers.name}.`);
                            } else {
                                console.log("The employee's role was updated.");
                            }
                        }
                    );
                    wantToExit();
                })
                .catch((error) => {
                    console.log(
                        "There was an error updating the employee in the database!"
                    );
                });
        }
    );
};

// delete an employee
const deleteEmployee = () => {
    Promise.all([selectAllRoles(), selectAllEmployees()]).then(
        ([roles, employees]) => {
            const [roleRows] = roles;
            const [employeeRows] = employees;

            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "name",
                        message: "Which employee do you want to delete?",
                        choices: employeeRows.map((r) => {
                            return { name: `${r.first_name} ${r.last_name}`, value: r.id };
                        }),
                    },
                ])
                .then((answers) => {
                    const queryResults = db.query(
                        `DELETE FROM employees
                     WHERE id = ${answers.name};`,
                        (err, results, fields) => {
                            if (err) {
                                console.log(`There was an error deleting ${answers.name}.`);
                            } else {
                                console.log("The employee was deleted.");
                            }
                        }
                    );
                    wantToExit();
                })
                .catch((error) => {
                    console.log(
                        "There was an error deleting the employee in the database!"
                    );
                });
        }
    );
};

const wantToExit = () =>
    inquirer
        .prompt([
            {
                name: "moreQuery",
                type: "confirm",
                message: "Want to do anything else?",
            },
        ])
        .then((answer) => {
            if (answer.moreQuery) {
                return toDo();
            } else {
                process.exit();
            }
        }
        );
