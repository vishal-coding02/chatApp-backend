const { fetchUsersService } = require("../../services/v1/user.service");

const fetchUsersController = async (req, res) => {
  try {
    const users = await fetchUsersService(req.query);
    return res.status(200).json({
      success: false,
      message: "all users fetched successfully",
      users,
    });
  } catch (err) {
    if (err.message === "user not found") {
      return res.status(404).json({ success: false, error: err.message });
    }
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { fetchUsersController };
