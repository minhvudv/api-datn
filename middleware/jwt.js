const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  const jwtSecret = process.env.JWT_SECRET;

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
 
    req.user = decoded.user;
    next();
  });
};

function hasAccess(user, path) {
  // Thực hiện kiểm tra quyền truy cập dựa trên thông tin người dùng và đường dẫn
  // Trả về true nếu có quyền truy cập, ngược lại trả về false
  // Ví dụ: Chỉ cho phép admin truy cập vào route '/admin'
  // if (path === '/admin-info' && user.role !== 'admin') {
  //   return false;
  // }
  // return true;
}

module.exports = verifyToken;
