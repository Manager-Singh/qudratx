const { getDashboardCountsHelper } = require('../helpers/dashboardCounts'); // adjust path

const getDashboardCounts = async (req, res) => {
  try {
    const counts = await getDashboardCountsHelper(req.user);

    res.status(200).json({
      message: 'Dashboard counts fetched successfully',
      data: counts,
    });
  } catch (error) {
    console.error('Error fetching dashboard counts:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

module.exports = {
  getDashboardCounts,
};
