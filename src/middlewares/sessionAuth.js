function sessionAuth(req, res, next) {
    if (!req.session.customerID) {
      return res.status(401).send({ message: 'Chưa đăng nhập' });
    }
    next(); // Cho phép request tiếp tục nếu đã đăng nhập
  }
  
  module.exports = sessionAuth;