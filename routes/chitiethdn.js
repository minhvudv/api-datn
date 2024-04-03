const express = require('express');
const route = express.Router();
const db = require('./dbconnect'); 

//lay ve toan bo bai chitiethoadonnhap
route.get('/',function(req,res){
    db.query('SELECT * FROM chitietdhn', (err, rows, fields) => {
        if (err) throw err
        console.log(rows);
        res.json(rows);
    });
});

//lay ve mot chitiethoadonnhap theo id
route.get('/getonce/:id', function(req,res){
    var id = req.params.id;
    var query ="SELECT * FROM chitietdhn WHERE idchitietdhn='" + id +"'";
    db.query(query, (err, rows, fields)=>{
        if (err) throw err
        console.log(rows);
        res.json(rows);
    });
});
//update chitiethoadonnhap
route.post('/update/:id', function(req, res) {
    var id = req.params.id;
    var Slnhap = req.body.Slnhap;
    var DGnhap = req.body.DGnhap;
    var DonhangnhapID  = req.body.DonhangnhapID;
    var SanPhamID = req.body.SanPhamID;


    var query = "UPDATE `chitietdhn` SET `Slnhap` = ?, `DGnhap` = ?, `DonhangnhapID` = ?, `SanPhamID` = ? WHERE `idchitietdhn` = ?";
    
    db.query(query, [Slnhap, DGnhap, DonhangnhapID, SanPhamID, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }

        console.log(result);
        res.json(result);
    });
});

//them chitiethoadonnhap
route.post('/add', function(req, res) {
    var Slnhap = req.body.Slnhap;
    var DGnhap = req.body.DGnhap;
    var DonhangnhapID  = req.body.DonhangnhapID;
    var SanPhamID = req.body.SanPhamID;

    var query = "INSERT INTO `chitietdhn` (`Slnhap`, `DGnhap`, `DonhangnhapID`, `SanPhamID`) VALUES (?, ?, ?, ?)";
    db.query(query, [Slnhap, DGnhap, DonhangnhapID, SanPhamID], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }

        console.log(result);
        res.json(result);
    });
});
//Xoa chitiethoadonnhap
route.get('/delete/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM chitietdhn WHERE idchitietdhn = ?";
    
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