const express = require('express');
const route = express.Router();
const db = require('./dbconnect'); 

//lay ve toan bo khachhang
route.get('/',function(req,res){
    db.query('SELECT * FROM khachhang', (err, rows, fields) => {
        if (err) throw err
        console.log(rows);
        res.json(rows);
    });
});

//lay ve mot khachhang theo id
route.get('/getonce/:id', function(req,res){
    var id = req.params.id;
    var query ="SELECT * FROM khachhang WHERE KhachHangID='" + id +"'";
    db.query(query, (err, rows, fields)=>{
        if (err) throw err
        console.log(rows);
        res.json(rows);
    });
});
//update khachhang
route.post('/update/:id', function(req, res) {
    var id = req.params.id;
    var HotenKH = req.body.HotenKH;
    var DiachiKH = req.body.DiachiKH;
    var EmailKH = req.body.EmailKH;
    var SdtKH = req.body.SdtKH;


    var query = "UPDATE `khachhang` SET `HotenKH` = ?, `DiachiKH` = ?, `EmailKH` = ?, `SdtKH` = ? WHERE `KhachHangID` = ?";
    
    db.query(query, [HotenKH, DiachiKH, EmailKH, SdtKH, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }

        console.log(result);
        res.json(result);
    });
});

//them khachhang
route.post('/add', function(req, res) {
    var HotenKH = req.body.HotenKH;
    var DiachiKH = req.body.DiachiKH;
    var EmailKH = req.body.EmailKH;
    var SdtKH = req.body.SdtKH;

    var query = "INSERT INTO `khachhang` (`HotenKH`, `DiachiKH`, `EmailKH`,'SdtKH') VALUES (?, ?, ?, ?)";
    db.query(query, [HotenKH, DiachiKH, EmailKH, SdtKH ], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }

        console.log(result);
        res.json(result);
    });
});
//Xoa khachhang
route.get('/delete/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM khachhang WHERE KhachHangID = ?";
    
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