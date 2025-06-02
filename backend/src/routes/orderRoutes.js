const express = require('express');
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  calculateWeeklyIncome,
  getAnalyticsReport,
  getWeeklyOrders
} = require('../controller/orderController');

const router = express.Router();

router.get('/weekly-orders', getWeeklyOrders);
router.get("/weekly", calculateWeeklyIncome);
router.get("/AnalyticsReport", getAnalyticsReport);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);


module.exports = router;
