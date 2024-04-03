const express = require('express');
const route = express.Router();
const db = require('./dbconnect'); 


//lay ve toan bo loai san pham
route.get('/',function(req,res){
    db.query('SELECT * FROM loaihang', (err, rows, fields) => {
        if (err) throw err
        console.log(rows);
        res.json(rows);
    });
});
//lay ve 1 loai san pham ->cho truong hop chi tiet san pham hoac sua san pham
route.get('/getonce/:id',function(req,res){

    var id = req.params.id;
    var query = "SELECT * FROM loaihang WHERE LoaiHangID='"+ id +"'";
    db.query(query, (err, rows, fields) => {
        if (err) throw err
        console.log(rows);
        res.json(rows);
    });
});


//update loai san pham
route.put('/update/:id', function(req, res) {
    var id = req.params.id;
    var TenLH = req.body.TenLH;

    var query = "UPDATE `loaihang` SET `TenLH` = ? WHERE `LoaiHangID` = ?";
    
    db.query(query, [TenLH, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }

        console.log(result);
        res.json(result);
    });
});



//them mot loai hang moi
route.post('/add', function(req, res) {
    var TenLH = req.body.TenLH;

    var query = "INSERT INTO `loaihang` (`TenLH`) VALUES (?)";
    
    db.query(query, [TenLH], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }

        console.log(result);
        res.json(result);
    });
});

module.exports = route;
//xoa 1 loai san pham
route.get('/delete/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM loaihang WHERE LoaiHangID = ?";
    
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