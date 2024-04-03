const express = require('express');
const route = express.Router();
const db = require('./dbconnect'); 

//lay ve toan bo bai hoadonban
route.get('/',function(req,res){
    db.query('SELECT * FROM donhangban', (err, rows, fields) => {
        if (err) throw err
        console.log(rows);
        res.json(rows);
    });
});

//lay ve mot hoadonban theo id
route.get('/getonce/:id', function(req,res){
    var id = req.params.id;
    var query ="SELECT * FROM donhangban WHERE DonhangbanID='" + id +"'";
    db.query(query, (err, rows, fields)=>{
        if (err) throw err
        console.log(rows);
        res.json(rows);
    });
});
//update hoadonban
route.put('/update/:id', function(req, res) {
    var id = req.params.id;
    var HoTen = req.body.HoTen;
    var DiaChi = req.body.DiaChi;
    var Sdt = req.body.Sdt;
    var Email  = req.body.Email;
    var ghichu = req.body.ghichu;


    var query = "UPDATE `donhangban` SET `HoTen` = ?, `DiaChi` = ?, `Sdt` = ?, `Email` = ?, `ghichu`= ? WHERE `DonhangbanID` = ?";
    
    db.query(query, [HoTen, DiaChi, Sdt, Email, ghichu, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }

        console.log(result);
        res.json(result);
    });
});

//them hoadonban
route.post('/add', function(req, res) {
    // Kiểm tra dữ liệu từ req.body
    var HoTen = req.body.HoTen;
    var DiaChi = req.body.DiaChi;
    var Sdt = req.body.Sdt;
    var Email = req.body.Email;
    var ghichu = req.body.ghichu;

    // Kiểm tra và xử lý giá trị Ngayban nếu cần
    // ...

    var query = "INSERT INTO `donhangban` (`HoTen`, `DiaChi`, `Email`, `Sdt`, `ghichu`) VALUES (?, ?, ?, ?, ?)";
    
    db.query(query, [HoTen, DiaChi, Email, Sdt, ghichu], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }

        console.log(result);
        res.json(result);
    });
});

//Xoa hoadonban
route.get('/delete/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM donhangban WHERE DonhangbanID = ?";
    
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