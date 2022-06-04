const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// GEt All of the roles
router.get('/roles', (req, res) => {
    const sql = `SELECT roles.*, departments.name 
             AS department_name 
             FROM roles 
             LEFT JOIN departments 
             ON roles.department_id = departments.id`;

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


// Get a single role
router.get('/api/role/:id', (req, res) => {
    const sql = `SELECT roles.*, departments.name 
             AS department_name 
             FROM roles 
             LEFT JOIN departments 
             ON roles.department_id = departments.id 
             WHERE roles.id = ?`;
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


// Create a role
router.post('/api/role', ({ body }, res) => {
    const errors = inputCheck(body, 'title', 'salary');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `INSERT INTO role (title,salary)
    VALUES (?,?)`;
    const params = [body.title,
    body.salary];

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

//Delete a role
router.delete('/api/role/:id', (req, res) => {
    const sql = `DELETE FROM role WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message });
            // checks if anything was deleted
        } else if (!result.affectedRows) {
            res.json({
                message: 'role not found'
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

// Update a role
router.put('/api/role/:id', (req, res) => {
    const errors = inputCheck(req.body, 'department_id');

    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `UPDATE role SET department_id = ? 
                 WHERE id = ?`;
    const params = [req.body.department_id, req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            // check if a record was found
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
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