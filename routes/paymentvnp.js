const express = require('express');
const route = express.Router();
const db = require('./dbconnect'); 
const moment = require('moment');

route.get('/redirect-to-vnp', (req, res) => {
    const vnpUrl = req.query.vnpUrl;
    if (vnpUrl) {
        res.redirect(vnpUrl);
    } else {
        res.status(400).send('URL không hợp lệ');
    }
});

// Tạo Payments_url
route.post('/create_payment_url', function (req, res, next) {
  
    const date = new Date();
    const Createdate = moment(date).format('YYYYMMDDHHmmss');

    const ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    const config = require('../config/default.json');
    const tmnCode = config.vnp_TmnCode;
    const secretKey = config.vnp_HashSecret;
    let vnpUrl = config.vnp_Url;
    const returnUrl = config.vnp_ReturnUrl;
    const orderId = moment(date).format('DDHHmmss');
    const amount = req.body.amount;
    const bankCode = req.body.bankCode;

    let locale = req.body.language;
    if(locale === null || locale === ''){
        locale = 'vn';
    }
    const currCode = 'VND';
    
    

    let vnp_Params = {
        'vnp_Version': '2.1.0',
        'vnp_Command': 'pay',
        'vnp_TmnCode': tmnCode,
        'vnp_Locale': locale,
        'vnp_CurrCode': currCode,
        'vnp_TxnRef': orderId,
        'vnp_OrderInfo': 'Thanh toan cho ma GD:' + orderId,
        'vnp_OrderType': 'other',
        'vnp_Amount': amount * 100,
        'vnp_ReturnUrl': returnUrl,
        'vnp_IpAddr': ipAddr,
        'vnp_CreateDate': Createdate,

    };

    if (bankCode) {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    

    
    const querystring = require('qs');
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    console.log("URL được tạo ra:", vnpUrl);
    res.json({ vnpUrl: vnpUrl });
    
})
route.get('/vnpay_return', function (req, res, next) {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let config = require('../config/default.json');
    let tmnCode = config.vnp_TmnCode;
    let secretKey = config.vnp_HashSecret;

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     

    if(secureHash === signed){
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

        res.render('success', {code: vnp_Params['vnp_ResponseCode']})
    } else{
        res.render('success', {code: '97'})
    }
});

route.get('/vnpay_ipn', function (req, res, next) {
    const vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];
    
    let orderId = vnp_Params['vnp_TxnRef'];
    let rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    let config = require('../config/default.json');
    let secretKey = config.vnp_HashSecret;
    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     
    
    let paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
    //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
    //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó
    
    let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
    let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
    if(secureHash === signed){ //kiểm tra checksum
        if(checkOrderId){
            if(checkAmount){
                if(paymentStatus=="0"){ //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
                    if(rspCode=="00"){
                        //thanh cong
                        //paymentStatus = '1'
                        // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
                        res.status(200).json({RspCode: '00', Message: 'Success'})
}
                    else {
                        //that bai
                        //paymentStatus = '2'
                        // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
                        res.status(200).json({RspCode: '00', Message: 'Success'})
                    }
                }
                else{
                    res.status(200).json({RspCode: '02', Message: 'This order has been updated to the payment status'})
                }
            }
            else{
                res.status(200).json({RspCode: '04', Message: 'Amount invalid'})
            }
        }       
        else {
            res.status(200).json({RspCode: '01', Message: 'Order not found'})
        }
    }
    else {
        res.status(200).json({RspCode: '97', Message: 'Checksum failed'})
    }
});

route.post('/querydr', function (req, res, next) {
    
    process.env.TZ = 'Asia/Hai_Duong';
    let date = new Date();

    const configs = require('../config/default.json');
    let crypto = require("crypto");
    
    let vnp_TmnCode = configs.vnp_TmnCode;
    let secretKey = configs.vnp_HashSecret;
    let vnp_Api = configs.vnp_Api;
    
    let vnp_TxnRef = req.body.orderId;
    let vnp_TransactionDate = req.body.transDate;
    
    let vnp_RequestId =moment(date).format('HHmmss');
    let vnp_Version = '2.1.0';
    let vnp_Command = 'querydr';
    let vnp_OrderInfo = 'Truy van GD ma:' + vnp_TxnRef;
    
    let vnp_IpAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    let currCode = 'VND';
    let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');
    
    let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TxnRef + "|" + vnp_TransactionDate + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;
    
    let hmac = crypto.createHmac("sha512", secretKey);
    let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex"); 
    
    let dataObj = {
        'vnp_RequestId': vnp_RequestId,
        'vnp_Version': vnp_Version,
        'vnp_Command': vnp_Command,
        'vnp_TmnCode': vnp_TmnCode,
        'vnp_TxnRef': vnp_TxnRef,
        'vnp_OrderInfo': vnp_OrderInfo,
        'vnp_TransactionDate': vnp_TransactionDate,
        'vnp_CreateDate': vnp_CreateDate,
        'vnp_IpAddr': vnp_IpAddr,
        'vnp_SecureHash': vnp_SecureHash
    };
    // /merchant_webapi/api/transaction
    request({
        url: vnp_Api,
        method: "POST",
        json: true,   
        body: dataObj
            }, function (error, response, body){
                console.log(response);
            });

});

route.post('/refund', function (req, res, next) {
    
    process.env.TZ = 'Asia/Hai_Duong';
    let date = new Date();

    let config = require('../config/default.json');
    let crypto = require("crypto");
let vnp_TmnCode = config.vnp_TmnCode;
    let secretKey = config.vnp_HashSecret;
    let vnp_Api = config.vnp_Api;
    
    let vnp_TxnRef = req.body.orderId;
    let vnp_TransactionDate = req.body.transDate;
    let vnp_Amount = req.body.amount *100;
    let vnp_TransactionType = req.body.transType;
    let vnp_CreateBy = req.body.user;
            
    let currCode = 'VND';
    
    let vnp_RequestId = moment(date).format('HHmmss');
    let vnp_Version = '2.1.0';
    let vnp_Command = 'refund';
    let vnp_OrderInfo = 'Hoan tien GD ma:' + vnp_TxnRef;
            
    let vnp_IpAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    
    let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');
    
    let vnp_TransactionNo = '0';
    
    let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TransactionType + "|" + vnp_TxnRef + "|" + vnp_Amount + "|" + vnp_TransactionNo + "|" + vnp_TransactionDate + "|" + vnp_CreateBy + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;
    let hmac = crypto.createHmac("sha512", secretKey);
    let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex");
    
     let dataObj = {
        'vnp_RequestId': vnp_RequestId,
        'vnp_Version': vnp_Version,
        'vnp_Command': vnp_Command,
        'vnp_TmnCode': vnp_TmnCode,
        'vnp_TransactionType': vnp_TransactionType,
        'vnp_TxnRef': vnp_TxnRef,
        'vnp_Amount': vnp_Amount,
        'vnp_TransactionNo': vnp_TransactionNo,
        'vnp_CreateBy': vnp_CreateBy,
        'vnp_OrderInfo': vnp_OrderInfo,
        'vnp_TransactionDate': vnp_TransactionDate,
        'vnp_CreateDate': vnp_CreateDate,
        'vnp_IpAddr': vnp_IpAddr,
        'vnp_SecureHash': vnp_SecureHash
    };
    
    request({
        url: vnp_Api,
        method: "POST",
        json: true,   
        body: dataObj
            }, function (error, response, body){
                console.log(response);
            });
    
});


function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}


module.exports = route;
// Vui lòng tham khảo thêm tại code demo
