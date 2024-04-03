const express = require('express');
const route = express.Router();
const db = require('./dbconnect'); 

//lay ve toan bo bai chitiethoadonban
route.get('/',function(req,res){
    db.query('SELECT * FROM chitietdhb', (err, rows, fields) => {
        if (err) throw err
        console.log(rows);
        res.json(rows);
    });
});

//lay ve mot chitiethoadonban theo id
route.get('/getonce/:id', function(req,res){
    var id = req.params.id;
    var query ="SELECT * FROM chitietdhb WHERE IDChitietDHB='" + id +"'";
    db.query(query, (err, rows, fields)=>{
        if (err) throw err
        console.log(rows);
        res.json(rows);
    });
});
//update chitiethoadonban
route.put('/update/:id', function(req, res) {
    var id = req.params.id;
    var Slban = req.body.Slban;
    var DGban = req.body.DGban;
    var DonhangbanID  = req.body.DonhangbanID;
    var SanPhamID = req.body.SanPhamID;
    var TenSanPham = req.body.TenSanPham;


    var query = "UPDATE `chitietdhb` SET `Slban` = ?, `DGban` = ?, `DonhangbanID` = ?, `SanPhamID` = ?,`TenSanPham`=? WHERE `IDChitietDHB` = ?";
    
    db.query(query, [Slban, DGban, DonhangbanID, SanPhamID, TenSanPham, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }

        console.log(result);
        res.json(result);
    });
});

//them chitiethoadonban
route.post('/add', function(req, res) {
    var Slban = req.body.Slban;
    var DGban = req.body.DGban;
    var DonhangbanID  = req.body.DonhangbanID;
    var SanPhamID = req.body.SanPhamID;
    var TenSanPham = req.body.TenSanPham;

    var query = "INSERT INTO `chitietdhb` (`Slban`, `DGban`, `DonhangbanID`, `SanPhamID`,`TenSanPham`) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [Slban, DGban, DonhangbanID, SanPhamID, TenSanPham], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }

        console.log(result);
        res.json(result);
    });
});
//Xoa chitiethoadonban
route.get('/delete/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM chitietdhb WHERE IDChitietDHB = ?";
    
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