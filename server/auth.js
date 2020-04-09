const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'megasport'
});

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connected to DB!');
});

function checkUserExists(req, res, next) {
    const { email, Identity_num } = req.body;
    let q = `SELECT * FROM users`
    connection.query(q, (err, results) => {
        if (err) {
            throw err;
        }
        const found = results.find(user => {
            if (user.email === email || user.Identity_num === +Identity_num) {
                return true
            } else {
                return false
            }
        })
        if (found) {
            req.user = found;
        }
        next();
    });
}
//check is user exists, if yes, return error, if no, return 200(for register page)
router.post('/check', checkUserExists, (req, res) => {
    if (req.user) {
        res.status(400).send('user is already exists')
    } else {
        res.json({})
    }
})
//get specifc user by email
router.get('/:email', (req, res) => {
    let q = `SELECT * FROM users
    where email='${req.params.email}'`
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
})

router.get('/:username', (req, res) => {
    let q = `SELECT id, firstname, lastname, email, city, street, role FROM Users
    where username = '${req.params.username}'`
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
})

router.post('/register', checkUserExists, (req, res) => {
    const { Identity_num, firstname, lastname, email, role, password, city, street } = req.body;
    if (!req.user) {//if user already exists, go to else, status 400
        if (Identity_num && firstname && lastname && email && role && password) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            console.log(hash);
            let q = `INSERT INTO Users (Identity_num, firstname, lastname, email, role, password, city, street)
VALUES (${Identity_num},"${firstname}", "${lastname}", "${email}","${role}" ,"${hash}", "${city}","${street}")`
            connection.query(q, (err, results) => {
                if (err) throw err;
                jwt.sign({ email, isAdmin: false }, "blah", { expiresIn: "10m" }, (err, token) => {
                    if (err) {
                        throw err
                    }
                    res.json({ token })
                })
            });
        } else {
            res.status(400).send('need more info in order to register');
        }
    } else {
        res.status(400).send('user is already exists');
    }
})

router.post('/login', checkUserExists, (req, res) => {
    const { email, password } = req.body;
    if (req.user) {
        if (bcrypt.compareSync(password, req.user.password)) {
            jwt.sign({ email, isAdmin: req.user.isAdmin }, "blah", { expiresIn: "10m" }, (err, token) => {
                if (err) {
                    throw err
                }
                res.json({ token })
            })
        } else {
            res.status(401).send('incorrect password')
        }
    } else {
        res.status(400).send('user is not exists');
    }
})

module.exports = router