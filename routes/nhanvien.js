const express = require('express');
const route = express.Router();
const db = require('./dbconnect'); 

//lay ve toan bo nhanvien
route.get('/',function(req,res){
    db.query('SELECT * FROM nhanvien', (err, rows, fields) => {
        if (err) throw err
        console.log(rows);
        res.json(rows);
    });
});

//lay ve mot nhanvien theo id
route.get('/getonce/:id', function(req,res){
    var id = req.params.id;
    var query ="SELECT * FROM nhanvien WHERE NhanVienID='" + id +"'";
    db.query(query, (err, rows, fields)=>{
        if (err) throw err
        console.log(rows);
        res.json(rows);
    });
});
//update nhanvien
route.post('/update/:id', function(req, res) {
    var id = req.params.id;
    var HotenNV = req.body.HotenNV;
    var GioitinhNV = req.body.GioitinhNV;
    var NgaySinhNV = req.body.NgaySinhNV;
    var DiachiNV = req.body.DiachiNV;
    var EmailNV= req.body.EmailNV;
    var SdtNV = req.body.SdtNV;


    var query = "UPDATE `nhanvien` SET `HotenNV` = ?, `GioitinhNV` = ?, `NgaySinhNV` = ?,  `DiachiNV` = ?, `EmailNV` = ?, `SdtNV` = ? WHERE `nhanvienID` = ?";
    
    db.query(query, [HotenNV, GioitinhNV, NgaySinhNV, DiachiNV, EmailNV, SdtNV, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }

        console.log(result);
        res.json(result);
    });
});

//them nhanvien
route.post('/add', function(req, res) {
    var HotenNV = req.body.HotenNV;
    var GioitinhNV = req.body.GioitinhNV;
    var NgaySinhNV = req.body.NgaySinhNV;
    var DiachiNV = req.body.DiachiNV;
    var EmailNV= req.body.EmailNV;
    var SdtNV = req.body.SdtNV;

    var query = "INSERT INTO `nhanvien` (`HotenNV`, `GioitinhNV`, `NgaySinhNV`,'DiachiNV', EmailNV,SdtNV ) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(query, [HotenNV, GioitinhNV, NgaySinhNV, DiachiNV , EmailNV, SdtNV], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }

        console.log(result);
        res.json(result);
    });
});
//Xoa nhanvien
route.get('/delete/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM nhanvien WHERE NhanVienID = ?";
    
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