const express = require('express');
const route = express.Router();
const db = require('./dbconnect'); 

//lay ve toan bo bai gioi thieu
route.get('/',function(req,res){
    db.query('SELECT * FROM gioithieu', (err, rows, fields) => {
        if (err) throw err
        console.log(rows);
        res.json(rows);
    });
});

//lay ve mot GioiThieu theo id
route.get('/getonce/:id', function(req,res){
    var id = req.params.id;
    var query ="SELECT * FROM gioithieu WHERE GioiThieuID='" + id +"'";
    db.query(query, (err, rows, fields)=>{
        if (err) throw err
        console.log(rows);
        res.json(rows);
    });
});
//update GioiThieu
route.post('/update/:id', function(req, res) {
    var id = req.params.id;
    var TenGioiThieu = req.body.TenGioiThieu;
    var AnhGioiThieu = req.body.AnhGioiThieu;
    var TomTat  = req.body.TomTat;
    var NoiDung = req.body.NoiDung;


    var query = "UPDATE `gioithieu` SET `TenGioiThieu` = ?, `AnhGioiThieu` = ?, `TomTat` = ?, `NoiDung` = ? WHERE `GioiThieuID` = ?";
    
    db.query(query, [TenGioiThieu, AnhGioiThieu, TomTat, NoiDung, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }

        console.log(result);
        res.json(result);
    });
});

//them GioiThieu
route.post('/add', function(req, res) {
    var TenGioiThieu = req.body.TenGioiThieu;
    var AnhGioiThieu = req.body.AnhGioiThieu;
    var TomTat  = req.body.TomTat;
    var NoiDung = req.body.NoiDung;

    var query = "INSERT INTO `gioithieu` (`TenGioiThieu`, `AnhGioiThieu`, `TomTat`, `NoiDung`) VALUES (?, ?, ?, ?)";
    db.query(query, [TenGioiThieu, AnhGioiThieu, TomTat, NoiDung], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }

        console.log(result);
        res.json(result);
    });
});
//Xoa GioiThieu
route.get('/delete/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM gioithieu WHERE GioiThieuID = ?";
    
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