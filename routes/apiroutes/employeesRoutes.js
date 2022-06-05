const express = require('express');
const router = express.Router();
const db = require('../../db/connection.js');
const inputCheck = require('../../utils/inputCheck');

// GEt All of the employee by last name
router.get('/employees', (req, res) => {
    const sql = `SELECT employees.*, roles.title
    AS roles_title
    FROM employees
    LEFT JOIN roles
    ON employees.roles_id = roles.id`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

//Get All employees by manager id
router.get('/employees', (req, res) => {
    const sql = `SELECT * FROM employees WHERE manager_id != NOT NULL`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});


// Get a single employee
router.get('/api/employee/:id', (req, res) => {
    const sql = `SELECT employees.*, roles.title
             AS roles_title
             FROM employees
             LEFT JOIN roles 
             ON employees.roles_id = roles.id 
             WHERE employees.id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});


// Create a employee
router.post('/api/employee', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'manager_id');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `INSERT INTO employees (first_name,last_name,manager_id) 
    VALUES (?,?,?)`;
    const params = [body.first_name,
    body.last_name, body.manager_id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

//Delete a employee
router.delete('/api/employee/:id', (req, res) => {
    const sql = `DELETE FROM employees WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message });
            // checks if anything was deleted
        } else if (!result.affectedRows) {
            res.json({
                message: 'employee not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// Update a employee
router.put('/api/employee/:id', (req, res) => {
    const errors = inputCheck(req.body, 'roles_title');

    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `UPDATE employee SET roles_title = ? 
                 WHERE id = ?`;
    const params = [req.body.role_id, req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            // check if a record was found
        } else if (!result.affectedRows) {
            res.json({
                message: 'employee not found'
            });
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

//update a employee manager id
router.put('/employee/:id', (req, res) => {
    // Data validation
    const errors = inputCheck(req.body, 'manager_id');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `UPDATE employees SET manager_id == ? WHERE id = ?`;
    const params = [req.body.manager_id, req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'employee not found'
            });
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

module.exports = router;