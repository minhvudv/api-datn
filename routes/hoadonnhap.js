const express = require('express');
const route = express.Router();
const db = require('./dbconnect'); 

//lay ve toan bo bai donhangnhap
route.get('/',function(req,res){
    db.query('SELECT * FROM donhangnhap', (err, rows, fields) => {
        if (err) throw err
        console.log(rows);
        res.json(rows);
    });
});

//lay ve mot donhangnhap theo id
route.get('/getonce/:id', function(req,res){
    var id = req.params.id;
    var query ="SELECT * FROM donhangnhap WHERE DonhangnhapID='" + id +"'";
    db.query(query, (err, rows, fields)=>{
        if (err) throw err
        console.log(rows);
        res.json(rows);
    });
});
//update donhangnhap
route.post('/update/:id', function(req, res) {
    var id = req.params.id;
    var NhanvienID = req.body.NhanvienID;
    var NhaCCID = req.body.NhaCCID;
    var Ngaynhap  = req.body.Ngaynhap;
    var Trietkhaunhap = req.body.Trietkhaunhap;


    var query = "UPDATE `donhangnhap` SET `NhanvienID` = ?, `NhaCCID` = ?, `Ngaynhap` = ?, `Trietkhaunhap` = ? WHERE `DonhangnhapID` = ?";
    
    db.query(query, [NhanvienID, NhaCCID, Ngaynhap, Trietkhaunhap, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }

        console.log(result);
        res.json(result);
    });
});

//them donhangnhap
route.post('/add', function(req, res) {
    var NhanvienID = req.body.NhanvienID;
    var NhaCCID = req.body.NhaCCID;
    var Ngaynhap  = req.body.Ngaynhap;
    var Trietkhaunhap = req.body.Trietkhaunhap;

    var query = "INSERT INTO `donhangnhap` (`NhanvienID`, `KhachhangID`, `Ngaynhap`, `Trietkhaunhap`) VALUES (?, ?, ?, ?)";
    db.query(query, [NhanvienID, NhaCCID, Ngaynhap, Trietkhaunhap], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }

        console.log(result);
        res.json(result);
    });
});
//Xoa donhangnhap
route.get('/delete/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM donhangnhap WHERE DonhangnhapID = ?";
    
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