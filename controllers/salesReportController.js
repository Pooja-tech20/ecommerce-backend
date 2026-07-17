const Order = require("../models/Order");

exports.getSalesReport = async (req, res) => {

  try {

    const deliveredOrders = await Order.find({
      orderStatus: "delivered",
    });

    let totalRevenue = 0;

    deliveredOrders.forEach((order) => {
      totalRevenue += order.totalAmount;
    });

    const today = new Date();

    const todayRevenue = deliveredOrders
      .filter((o) =>

        o.createdAt.toDateString() ===
        today.toDateString()

      )
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const report = {

      totalRevenue,

      totalOrders: deliveredOrders.length,

      todayRevenue,

      averageOrderValue:
        deliveredOrders.length === 0
          ? 0
          : totalRevenue /
            deliveredOrders.length,

    };

    res.json({

      success: true,

      report,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};