const express = require('express');
const route = express.Router();
const db = require('./dbconnect'); 

//lay ve toan bo blog
route.get('/',function(req,res){
    db.query('SELECT * FROM blog', (err, rows, fields) => {
        if (err) throw err
        console.log(rows);
        res.json(rows);
    });
});

//lay ve mot blog theo id
route.get('/getonce/:id', function(req,res){
    var id = req.params.id;
    var query ="SELECT * FROM blog WHERE BlogID='" + id +"'";
    db.query(query, (err, rows, fields)=>{
        if (err) throw err
        console.log(rows);
        res.json(rows);
    });
});
//update blog
route.put('/update/:id', function(req, res) {
    var id = req.params.id;
    var TenBlog = req.body.TenBlog;
    var AnhBlog = req.body.AnhBlog;
    var TomTat  = req.body.TomTat;
    var NoiDung = req.body.NoiDung;
    var NguoiDang = req.body.NguoiDang;

    var query = "UPDATE `blog` SET `TenBlog` = ?, `AnhBlog` = ?, `TomTat` = ?, `NoiDung` = ?, `NguoiDang` = ? WHERE `BlogID` = ?";
    
    db.query(query, [TenBlog, AnhBlog, TomTat, NoiDung, NguoiDang, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }

        console.log(result);
        res.json(result);
    });
});

//them Blog
route.post('/add', function(req, res) {
    var TenBlog = req.body.TenBlog;
    var AnhBlog = req.body.AnhBlog;
    var TomTat  = req.body.TomTat;
    var NoiDung = req.body.NoiDung;
    var NguoiDang = req.body.NguoiDang; 

    var query = "INSERT INTO `blog` (`TenBlog`, `AnhBlog`, `TomTat`, `NoiDung`, `NguoiDang`) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [TenBlog, AnhBlog, TomTat, NoiDung, NguoiDang], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }

        console.log(result);
        res.json(result);
    });
});
//Xoa blog
route.get('/delete/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM blog WHERE BlogID = ?";
    
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