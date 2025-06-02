const UniqueVisitor = require('../models/UniqueVisitor');

async function getUniqueVisitors(req, res) {
  try {
    const view = req.query.view || 'monthly'; // 'monthly' or 'weekly'
    const now = new Date();

    let startDate;

    if (view === 'weekly') {
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      startDate.setDate(startDate.getDate() - startDate.getDay());
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const data = await UniqueVisitor.aggregate([
      { $match: { date: { $gte: startDate } } },
      {
        $group: {
          _id: { $dayOfMonth: "$date" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const resultLength = view === 'weekly' 
      ? 7 
      : new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    const result = Array(resultLength).fill(0);

    data.forEach(({ _id, count }) => {
      if (view === 'weekly') {
        const date = new Date(now.getFullYear(), now.getMonth(), _id);
        const dayOfWeek = date.getDay();
        result[dayOfWeek] = count;
      } else {
        result[_id - 1] = count;
      }
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching unique visitors:', error);
    res.status(500).json({ error: 'Failed to fetch unique visitor data' });
  }
}

module.exports = {
  getUniqueVisitors,
};
