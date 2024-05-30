const bcrypt = require('bcrypt');

const User = require('../models/user');
const CustomerInfo = require('../models/customerInfo');

let register = async (req, res, next) => {
    let email = req.body.email;
    if (email === undefined) return res.status(400).send('Trường email không tồn tại');
    let password = req.body.password;
    if (password === undefined) return res.status(400).send('Trường password không tồn tại');
    let name = req.body.name;
    if (name === undefined) return res.status(400).send('Trường name không tồn tại');
    let phoneNumber = req.body.phoneNumber;
    if (phoneNumber === undefined) return res.status(400).send('Trường phoneNumber không tồn tại');

    let customer = await User.findOne({ where: { email, roleID: 2 } });
    if (customer) return res.status(409).send("Email đã tồn tại");
    else {
        try {
            let hashPassword = bcrypt.hashSync(password, 10);
            let newCustomer = await User.create({ email: email, password: hashPassword, roleID: 2 });
            let newCustomerInfo = await CustomerInfo.create({ userID: newCustomer.userID, name, phoneNumber });
            return res.send({
                customerID: newCustomer.userID,
                email: newCustomer.email,
                name: newCustomerInfo.name,
                phoneNumber: newCustomerInfo.phoneNumber,
                address: newCustomerInfo.address
            });
        } catch (err) {
            console.log(err);
            return res.status(400).send("Có lỗi trong quá trình tạo tài khoản vui lòng thử lại");
        }
    }
}

let login = async (req, res, next) => {
    let email = req.body.email;
    if (email === undefined) return res.status(400).send('Trường email không tồn tại');
    let password = req.body.password;
    if (password === undefined) return res.status(400).send('Trường password không tồn tại');

    try {
        let customer = await User.findOne({
            where: { email, roleID: 2 },
            include: [
                { model: CustomerInfo, attributes: ['name', 'phoneNumber', 'address'] },
            ]
        });
        if (!customer) {
            return res.status(401).send("Email không chính xác");
        }

        let isPasswordValid = bcrypt.compareSync(password, customer.password);
        if (!isPasswordValid) {
            return res.status(401).send("Mật khẩu không chính xác");
        }

        return res.send({
            customerID: customer.userID,
            email: customer.email,
            name: customer.CustomerInfo.name,
            phoneNumber: customer.CustomerInfo.phoneNumber,
            address: customer.CustomerInfo.address
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send("Có lỗi trong quá trình đăng nhập vui lòng thử lại");
    }
}

let update = async (req, res, next) => {
    let userID = req.body.userID;
    if (userID === undefined) return res.status(400).send('Trường userID không tồn tại');
    let name = req.body.name;
    if (name === undefined) return res.status(400).send('Trường name không tồn tại');
    let phoneNumber = req.body.phoneNumber;
    if (phoneNumber === undefined) return res.status(400).send('Trường phoneNumber không tồn tại');
    let address = req.body.address;
    if (address === undefined) return res.status(400).send('Trường address không tồn tại');

    try {
        let customer = await User.findOne({ where: { userID, roleID: 2 } });
        if (!customer) return res.status(409).send("Customer không tồn tại");

        let numberUpdate = await CustomerInfo.update(
            { name, phoneNumber, address },
            { where: { userID } }
        )
        if (numberUpdate) {
            return res.send({
                name,
                phoneNumber,
                address
            });
        } else {
            return res.status(400).send("Có lỗi trong quá trình cập nhật vui lòng thử lại");
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send("Có lỗi trong quá trình cập nhật vui lòng thử lại");
    }
}

module.exports = {
    register,
    login,
    update
};