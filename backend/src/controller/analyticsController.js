const moment = require('moment');
const Order = require('../models/Order');
const UserAdmin = require('../models/User');
const PageView = require('../models/PageView'); // Import the PageView model

// Helper: Get start/end dates for this and last week
const getWeekRanges = () => {
  const startOfThisWeek = moment().startOf('week').toDate();
  const endOfThisWeek = moment().endOf('week').toDate();
  const startOfLastWeek = moment().subtract(1, 'week').startOf('week').toDate();
  const endOfLastWeek = moment().subtract(1, 'week').endOf('week').toDate();

  return { startOfThisWeek, endOfThisWeek, startOfLastWeek, endOfLastWeek };
};

// Helper: Calculate percentage change with safe handling for division by zero
function calcPercentageChange(current, previous) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

const getAnalytics = async (req, res) => {
  try {
    const { startOfThisWeek, endOfThisWeek, startOfLastWeek, endOfLastWeek } = getWeekRanges();

    // Count Sales (with certain statuses) this week and last week
    const salesThisWeek = await Order.countDocuments({
      status: { $in: ["Paid", "Processing", "Shipped", "Delivered"] },
      createdAt: { $gte: startOfThisWeek, $lte: endOfThisWeek },
    });
    const salesLastWeek = await Order.countDocuments({
      status: { $in: ["Paid", "Processing", "Shipped", "Delivered"] },
      createdAt: { $gte: startOfLastWeek, $lte: endOfLastWeek },
    });

    // Sum Revenue (with certain statuses) this week and last week
    const revenueThisWeekAgg = await Order.aggregate([
      {
        $match: {
          status: { $in: ["Paid", "Processing", "Shipped", "Delivered"] },
          createdAt: { $gte: startOfThisWeek, $lte: endOfThisWeek },
        },
      },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
    ]);
    const revenueLastWeekAgg = await Order.aggregate([
      {
        $match: {
          status: { $in: ["Paid", "Processing", "Shipped", "Delivered"] },
          createdAt: { $gte: startOfLastWeek, $lte: endOfLastWeek },
        },
      },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
    ]);
    const revenueThisWeek = revenueThisWeekAgg[0]?.totalRevenue || 0;
    const revenueLastWeek = revenueLastWeekAgg[0]?.totalRevenue || 0;

    // Count all orders this week and last week (any status)
    const ordersThisWeek = await Order.countDocuments({
      createdAt: { $gte: startOfThisWeek, $lte: endOfThisWeek },
    });
    const ordersLastWeek = await Order.countDocuments({
      createdAt: { $gte: startOfLastWeek, $lte: endOfLastWeek },
    });

    // Count new users this week and last week
    const usersThisWeek = await UserAdmin.countDocuments({
      createdAt: { $gte: startOfThisWeek, $lte: endOfThisWeek },
    });
    const usersLastWeek = await UserAdmin.countDocuments({
      createdAt: { $gte: startOfLastWeek, $lte: endOfLastWeek },
    });

    // Count page views this week and last week
    const pageViewsThisWeekAgg = await PageView.aggregate([
      {
        $match: {
          timestamp: { $gte: startOfThisWeek, $lte: endOfThisWeek },
        },
      },
      {
        $group: { _id: null, totalViews: { $sum: 1 } },
      },
    ]);
    const pageViewsLastWeekAgg = await PageView.aggregate([
      {
        $match: {
          timestamp: { $gte: startOfLastWeek, $lte: endOfLastWeek },
        },
      },
      {
        $group: { _id: null, totalViews: { $sum: 1 } },
      },
    ]);
    const viewsThisWeek = pageViewsThisWeekAgg[0]?.totalViews || 0;
    const viewsLastWeek = pageViewsLastWeekAgg[0]?.totalViews || 0;

    // Calculate percentage changes for all metrics
    const salesChange = calcPercentageChange(salesThisWeek, salesLastWeek);
    const revenueChange = calcPercentageChange(revenueThisWeek, revenueLastWeek);
    const ordersChange = calcPercentageChange(ordersThisWeek, ordersLastWeek);
    const usersChange = calcPercentageChange(usersThisWeek, usersLastWeek);
    const viewsChange = calcPercentageChange(viewsThisWeek, viewsLastWeek);

    // Prepare response data for the frontend
    const analytics = [
      {
        title: "Page Views",
        count: viewsThisWeek,
        percentage: `${viewsChange.toFixed(2)}%`,
        color: viewsChange >= 0 ? "green" : "red",
        bgColor: viewsChange >= 0 ? "#e6f4ea" : "#fdecea",
      },
      {
        title: "Total Revenue",
        count: `₹${revenueThisWeek.toFixed(2)}`,
        percentage: `${revenueChange.toFixed(2)}%`,
        color: revenueChange >= 0 ? "green" : "red",
        bgColor: revenueChange >= 0 ? "#e6f4ea" : "#fdecea",
      },
      {
        title: "Total Orders",
        count: ordersThisWeek,
        percentage: `${ordersChange.toFixed(2)}%`,
        color: ordersChange >= 0 ? "green" : "red",
        bgColor: ordersChange >= 0 ? "#e6f4ea" : "#fdecea",
      },
      {
        title: "New Users",
        count: usersThisWeek,
        percentage: `${usersChange.toFixed(2)}%`,
        color: usersChange >= 0 ? "green" : "red",
        bgColor: usersChange >= 0 ? "#e6f4ea" : "#fdecea",
      },
    ];

    return res.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAnalytics };
