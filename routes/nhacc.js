const express = require('express');
const route = express.Router();
const db = require('./dbconnect'); 

//lay ve toan bo nhacc
route.get('/',function(req,res){
    db.query('SELECT * FROM nhacc', (err, rows, fields) => {
        if (err) throw err
        console.log(rows);
        res.json(rows);
    });
});

//lay ve mot nhacc theo id
route.get('/getonce/:id', function(req,res){
    var id = req.params.id;
    var query ="SELECT * FROM nhacc WHERE NhaCCID='" + id +"'";
    db.query(query, (err, rows, fields)=>{
        if (err) throw err
        console.log(rows);
        res.json(rows);
    });
});
//update nhacc
route.post('/update/:id', function(req, res) {
    var id = req.params.id;
    var TenNCC = req.body.TenNCC;
    var diachiNCC = req.body.diachiNCC;
    var SdtNCC  = req.body.SdtNCC;

    var query = "UPDATE `nhacc` SET `TenNCC` = ?, `diachiNCC` = ?, `SdtNCC` = ? WHERE `NhaCCID` = ?";
    
    db.query(query, [TenNCC, diachiNCC, SdtNCC, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }

        console.log(result);
        res.json(result);
    });
});

//them nhacc
route.post('/add', function(req, res) {
    var TenNCC = req.body.TenNCC;
    var diachiNCC = req.body.diachiNCC;
    var SdtNCC  = req.body.SdtNCC;

    var query = "INSERT INTO `nhacc` (`TenNCC`, `diachiNCC`, `SdtNCC`) VALUES (?, ?, ?)";
    db.query(query, [TenNCC, diachiNCC, SdtNCC], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }

        console.log(result);
        res.json(result);
    });
});
//Xoa nhacc
route.get('/delete/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM nhacc WHERE NhaCCID = ?";
    
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