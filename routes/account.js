    const express = require('express');
    const route = express.Router();
    const db = require('./dbconnect'); 
    const jwt = require('jsonwebtoken');
    const verifyToken = require('../middleware/jwt');
    const bcrypt = require('bcrypt');


    // Trong handler của một endpoint cụ thể
    route.get('/admin-info', verifyToken, (req, res) => {
        const admin = req.user;
        res.json(admin );
      });
    //lay ve toan bo account
    route.get('/', function (req, res) {
        db.query('SELECT * FROM account', (err, rows, fields) => {
            if (err) throw err;
            const hashedRows = rows.map(row => {
                return {
                    ...row,
                    password: hashPassword(row.password)
                };
            });
            console.log(hashedRows);
            res.json(hashedRows);
        });
    });

    function hashPassword(password) {
        const saltRounds = 10; 
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        return hash;
    }


    //lay ve mot account theo id
    route.get('/getonce/:id', function(req,res){
        var id = req.params.id;
        var query ="SELECT * FROM account WHERE id='" + id +"'";
        db.query(query, (err, rows, fields)=>{
            if (err) throw err
            console.log(rows);
            res.json(rows);
        });
    });


    //login
    route.post('/login',function(req,res){
        var id = req.params.id;
        var email = req.body.email;
        var password = req.body.password;
        var query = "SELECT * FROM account WHERE email='"+ email +"' and password='"+password+"'";
        db.query(query, [email, password], (err, rows, fields) => {
            if (err) throw err
            console.log(rows);
            res.json(rows);
        });
    });



    //new login
    route.post('/admin-login', function(req, res, next) {
        const { email, password } = req.body;

        var sql = "SELECT id, username, email, role FROM account WHERE email = ? AND password = ?";
        db.query(sql, [email, password], function (err, results) {
            if (err) {
                console.error('Lỗi dữ liệu:', err);
                return res.status(500).jsonp({ error: 'Lỗi máy chủ mysql .' });
            }

            if (results.length === 0) {
                return res.status(401).jsonp({ error: 'Email hoặc mật khẩu không hợp lệ' });
            }

            const user = {
                id: results[0].id, // Truy cập vào phần tử đầu tiên trong mảng kết quả
                username: results[0].username,
                email: results[0].email,
                role: results[0].role
            };

            require('dotenv').config();
            const jwtSecret = process.env.JWT_SECRET;

            if (!jwtSecret) {
                console.error('Thiếu giá trị cho JWT_SECRET');
                return res.status(500).jsonp({ error: 'Lỗi máy chủ.' });
            }

            try {
                const token = jwt.sign({ user }, jwtSecret, { expiresIn: '1h' });
                res.jsonp({ token, user });
            } catch (error) {
                console.error('Lỗi khi tạo token:', error);
                return res.status(500).jsonp({ error: 'Lỗi tạo token.' });
            }
        });
    });





    //update account
    route.put('/update/:id', function(req, res) {
        var id = req.params.id;
        var username = req.body.username;
        var email = req.body.email;
        var password  = req.body.password;
        var role = req.body.role;

        var query = "UPDATE `account` SET `username` = ?, `email` = ?, `password` = ?, `role` = ? WHERE `id` = ?";
        
        db.query(query, [username, email, password, role, id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }

            console.log(result);
            res.json(result);
        });
    });

    //them account
    route.post('/add', function(req, res) {
        var username = req.body.username;
        var email = req.body.email;
        var password  = req.body.password;
        var role = req.body.role;

        var query = "INSERT INTO `account` (`username`, `email`, `password`, `role`) VALUES (?, ?, ?,  COALESCE(?, 'customer'))";
        db.query(query, [username, email, password, role], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }

            console.log(result);
            res.json(result);
        });
    });


    //Xoa account
    route.get('/delete/:id', function(req, res) {
        var id = req.params.id;
        var query = "DELETE FROM account WHERE id = ?";
        
        db.query(query, [id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }

            console.log(result);
            res.json(result);
        });
    });
    module.exports = route;