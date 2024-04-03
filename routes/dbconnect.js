const mysql = require('mysql')
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'thai1926'
})

// Kết nối cơ sở dữ liệu
db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối cơ sở dữ liệu: ' + err.stack);
    return;
  }
  console.log('Đã kết nối với cơ sở dữ liệu ID ' + db.threadId);
});
module.exports = db;
