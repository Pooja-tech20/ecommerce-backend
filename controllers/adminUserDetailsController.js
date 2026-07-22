const User = require("../models/User");
const Address = require("../models/Address");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");


exports.getUserDetails = async (req, res) => {
  try {

    const userId = req.params.id;


    const user = await User.findById(userId)
      .select("-password");


    if (!user) {
      return res.status(404).json({
        success:false,
        message:"User not found"
      });
    }


    const addresses = await Address.find({
      user:userId
    });


    const orders = await Order.find({
      user:userId
    })
    .sort({
      createdAt:-1
    });



    const ordersWithItems = await Promise.all(
      orders.map(async(order)=>{


        const items = await OrderItem.find({
          order:order._id
        });


        return {
          orderId:order._id,

          orderDate:
          order.createdAt,

          items,

          totalAmount:
          order.totalAmount,

          status:
          order.orderStatus
        }

      })
    );



    res.json({

      success:true,

      user,

      addresses,

      orders:ordersWithItems

    });



  }
  catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};