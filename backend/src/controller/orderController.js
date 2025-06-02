const Order = require('../models/Order'); // Import the Order model

// Fetch all orders
const getAllOrders = async (req, res) => {
  try {
    // Fetch all orders with user and product details populated
    const orders = await Order.find()
      .populate('userId', 'name email') // Populate user details
      .populate('items.productId', 'name price'); // Populate product details

    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ message: 'Failed to fetch orders.' });
  }
};

// Fetch a specific order by ID
const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id)
      .populate('userId', 'name email') // Populate user details
      .populate('items.productId', 'name price'); // Populate product details

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return res.status(500).json({ message: 'Failed to fetch the order.' });
  }
};

// Create a new order
const createOrder = async (req, res) => {
  const { userId, items, amount, status, tracking } = req.body;

  // Optionally: Validate required fields here

  try {
    const newOrder = new Order({
      userId,
      items,
      amount,
      status,
      tracking,
    });

    const savedOrder = await newOrder.save();
    return res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Failed to create the order.' });
  }
};

// Update an existing order
const updateOrder = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Optionally: Validate updateData or restrict fields to update

  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true, // Make sure update respects schema validation
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({ message: 'Failed to update the order.' });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    return res.status(200).json({ message: 'Order deleted successfully.' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return res.status(500).json({ message: 'Failed to delete the order.' });
  }
};

const calculateWeeklyIncome = async (req, res) => {
  try {
    // Calculate the start of the week (last 7 days)
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    // Find orders created within the last week and sum their amounts
    const weeklyIncome = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek }, // Filter orders created within the last 7 days
          status: { $in: ["Paid", "Delivered"] }, // Include only paid and delivered orders
        },
      },
      {
        $group: {
          _id: null, // Group all matching documents
          totalIncome: { $sum: "$amount" }, // Sum the "amount" field
        },
      },
    ]);

    // Extract the total income or default to 0 if no orders found
    const totalIncome = weeklyIncome[0]?.totalIncome || 0;

    res.status(200).json({ weeklyIncome: totalIncome });
  } catch (error) {
    console.error("Error calculating weekly income:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


async function getAnalyticsReport(req, res) {
  try {
    const now = new Date();

    // Define dates for comparison (last 7 days, and previous 7 days)
    const endDate = now;
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 7);

    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(startDate.getDate() - 7);

    const prevEndDate = new Date(startDate);

    // Total amount for last 7 days
    const recentOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lt: endDate },
          status: { $ne: 'Cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const recentTotal = recentOrders.length > 0 ? recentOrders[0].totalAmount : 0;

    // Total amount for previous 7 days
    const prevOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: prevStartDate, $lt: prevEndDate },
          status: { $ne: 'Cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const prevTotal = prevOrders.length > 0 ? prevOrders[0].totalAmount : 0;

    // Calculate Finance Growth % (avoid divide by zero)
    let financeGrowth = 0;
    if (prevTotal > 0) {
      financeGrowth = ((recentTotal - prevTotal) / prevTotal) * 100;
    } else if (recentTotal > 0) {
      financeGrowth = 100; // from 0 to some amount = 100% growth
    }

    // Calculate Expenses Ratio = Cancelled amount / total amount (last 7 days)
    const cancelledOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lt: endDate },
          status: 'Cancelled'
        }
      },
      {
        $group: {
          _id: null,
          cancelledAmount: { $sum: '$amount' }
        }
      }
    ]);
    const cancelledAmount = cancelledOrders.length > 0 ? cancelledOrders[0].cancelledAmount : 0;
    const expensesRatio = recentTotal > 0 ? (cancelledAmount / recentTotal) * 100 : 0;

    // Business Risk Cases: Low / Medium / High based on cancelled orders count
    const cancelledCount = await Order.countDocuments({
      createdAt: { $gte: startDate, $lt: endDate },
      status: 'Cancelled'
    });

    let riskLevel = 'Low';
    if (cancelledCount > 10) riskLevel = 'High';
    else if (cancelledCount > 3) riskLevel = 'Medium';

    // Orders data for chart: sum amounts grouped by day (last 7 days)
    const ordersByDay = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lt: endDate },
          status: { $ne: 'Cancelled' }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format to have all 7 days (fill missing days with 0)
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      dates.push(d.toISOString().slice(0, 10)); // yyyy-mm-dd
    }

    const orders = dates.map(date => {
      const dayData = ordersByDay.find(o => o._id === date);
      return {
        date,
        amount: dayData ? dayData.totalAmount : 0
      };
    });

    res.json({
      financeGrowth: parseFloat(financeGrowth.toFixed(2)),
      expensesRatio: parseFloat(expensesRatio.toFixed(2)),
      riskLevel,
      orders
    });
  } catch (error) {
    console.error('Error fetching analytics report:', error);
    res.status(500).json({ message: 'Server error fetching analytics report' });
  }
}

const getWeeklyOrders = async (req, res) => {
  try {
    // Get the start of the current week (Sunday)
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const data = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfWeek } } },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          totalAmount: { $sum: "$amount" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Initialize result array with zeros for 7 days
    const result = Array(7).fill(0);

    // Fill the results: Mongo $dayOfWeek returns 1 for Sunday ... 7 for Saturday
    data.forEach(({ _id, totalAmount }) => {
      result[_id - 1] = totalAmount;
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching weekly orders:", error);
    res.status(500).json({ error: "Failed to fetch weekly order data" });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  calculateWeeklyIncome,
  getAnalyticsReport, 
  getWeeklyOrders
};
