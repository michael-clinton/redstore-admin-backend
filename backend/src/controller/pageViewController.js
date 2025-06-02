const PageView = require('../models/PageView');

// Controller to fetch unique visitors data
const getUniqueVisitors = async (req, res) => {
  const { view } = req.query; // 'weekly' or 'monthly'
  try {
    // Determine grouping format based on the requested view
    const groupByFormat = view === 'monthly' ? '%Y-%m' : '%Y-%U'; // Group by month or week

    // Aggregate query to calculate unique visitors
    const data = await PageView.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: groupByFormat, date: '$timestamp' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date
    ]);

    res.status(200).json(data); // Send the aggregated data
  } catch (error) {
    console.error('Error fetching unique visitors:', error);
    res.status(500).json({ message: 'Server error fetching unique visitors' });
  }
};

module.exports = {
  getUniqueVisitors,
};