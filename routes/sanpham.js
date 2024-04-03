const express = require('express');
const route = express.Router();
const db = require('./dbconnect'); 

//lay ve toan bo san pham
route.get('/',function(req,res){
    db.query('SELECT * FROM sanpham', (err, rows, fields) => {
        if (err) throw err
        console.log(rows);
        res.json(rows);
    });
});
//lay ve 1 san pham theo id
route.get('/getonce/:id',function(req,res){
    var id= req.params.id; 
    var query ="SELECT * FROM sanpham WHERE SanPhamID= '"+ id +"'";
    db.query(query,(err, rows, fields)=>{
        if (err) throw err
        console.log(rows);
        res.json(rows);
    });
});
//lay ve san pham moi
route.get('/sanphammoi', (req, res) => {
    const query = 'CALL GetNewProducts();';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi thực hiện thủ tục lưu trữ GetNewProducts: ' + err.stack);
            return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }

        res.json(results[0]);
    });
});
//lay ve san pham ban chay
route.get('/sanphambanchay', (req, res) => {
    const query = 'CALL GetBestSellingProducts();';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi thực hiện thủ tục lưu trữ GetBestSellingProducts: ' + err.stack);
            return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }

        // Trả về kết quả từ thủ tục lưu trữ
        res.json(results[0]);
    });
});

//lay ve san pham theo loai
route.get('/getproductsbycategory/:categoryName', (req, res) => {
    const categoryName = req.params.categoryName;

    const sql = `CALL GetProductsByCategory(?)`;
    db.query(
        sql, [categoryName],
        (err, results) => {
            if (err) {
                console.error("Lỗi khi lấy thông tin sản phẩm theo danh mục:", err);
                return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            res.json(results[0]); 
        }
    );
});

//update san pham
route.put('/update/:id', function(req, res){
    var id = req.params.id;
    var LoaiHangID = req.body.LoaiHangID;
    var TenSanPham = req.body.TenSanPham;
    var AnhSanPham = req.body.AnhSanPham;
    var GiaBan = req.body.GiaBan;
    var Giong = req.body.Giong;
    var PhuongPhapSoChe = req.body.PhuongPhapSoChe;
    var DoCaoTrong = req.body.DoCaoTrong;
    var MucRang = req.body.MucRang;
    var HuongVi = req.body.HuongVi;
    var Slton = req.body.Slton;

    var query = "UPDATE `sanpham` SET `LoaiHangID`=?, `TenSanPham`=?, `AnhSanPham`=?, `GiaBan`=?, `Giong`=?, `PhuongPhapSoChe`=?, `DoCaoTrong`=?, `MucRang`=?, `HuongVi`=?, `Slton`=? WHERE `SanPhamID`=?";
    db.query(query, [LoaiHangID, TenSanPham,AnhSanPham, GiaBan, Giong, PhuongPhapSoChe, DoCaoTrong, MucRang, HuongVi, Slton,  id], (err, result) =>{
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }

        console.log(result);
        res.json(result);
    });
});

//them san pham moi 1

route.post('/add',function(req,res){ 
    var LoaiHangID = req.body.LoaiHangID;
    var TenSanPham = req.body.TenSanPham;
    var AnhSanPham = req.body.AnhSanPham;
    var GiaBan = req.body.GiaBan;
    var Giong = req.body.Giong;
    var PhuongPhapSoChe = req.body.PhuongPhapSoChe;
    var DoCaoTrong = req.body.DoCaoTrong;
    var MucRang = req.body.MucRang;
    var HuongVi = req.body.HuongVi;
    var Slton = req.body.Slton;

    var query = "INSERT INTO `sanpham` (`LoaiHangID`, `TenSanPham`, `AnhSanPham`, `GiaBan`, `Giong`, `PhuongPhapSoChe`, `DoCaoTrong`, `MucRang`, `HuongVi`, `Slton`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    db.query(query, [LoaiHangID, TenSanPham, AnhSanPham, GiaBan, Giong, PhuongPhapSoChe, DoCaoTrong, MucRang, HuongVi, Slton], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
        }

        console.log(result);
        res.json(result);
    });

});
//Xoasanpham

route.get('/delete/:id', function(req, res) {
    var id = req.params.id;
    var query = "DELETE FROM sanpham WHERE SanPhamID = ?";
    
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
