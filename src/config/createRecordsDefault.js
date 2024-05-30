const Role = require('../models/role')
const OrderState = require('../models/orderState')

module.exports = {

    createRecordsDefault: async () => {
        try {
           const roleAdmin = await Role.findOne({ where: { roleID: 1 } })
            if (roleAdmin == null) await Role.create({ roleID: 1, roleName: 'admin' })

          const  roleCustomer = await Role.findOne({ where: { roleID: 2 } })
            if (roleCustomer == null) await Role.create({ roleID: 2, roleName: 'customer' })

           const state1 = await OrderState.findOne({ where: { orderStateID: 1 } })
            if (state1 == null) await OrderState.create({ orderStateID: 1, orderStateName: 'Chờ Xác Nhận' })

          const  state2 = await OrderState.findOne({ where: { orderStateID: 2 } })
            if (state2 == null) await OrderState.create({ orderStateID: 2, orderStateName: 'Đã Xác Nhận' })

          const  state3 = await OrderState.findOne({ where: { orderStateID: 3 } })
            if (state3 == null) await OrderState.create({ orderStateID: 3, orderStateName: 'Đang Vận Chuyển' })

         const   state4 = await OrderState.findOne({ where: { orderStateID: 4 } })
            if (state4 == null) await OrderState.create({ orderStateID: 4, orderStateName: 'Đã Giao' })

          const  state5 = await OrderState.findOne({ where: { orderStateID: 5 } })
            if (state5 == null) await OrderState.create({ orderStateID: 5, orderStateName: 'Đã Hủy' })

          const  state6 = await OrderState.findOne({ where: { orderStateID: 6 } })
            if (state6 == null) await OrderState.create({ orderStateID: 6, orderStateName: 'Hủy Bởi Shop' })
        } catch (err) {
            console.log(err)
        }
    }
}