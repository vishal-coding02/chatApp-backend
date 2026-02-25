const Users = require("../../models/v1/users.model");

const fetchUsersService = async (query) => {
  const { name, page = 1 } = query;
  const limit = 3;

  let filter = {};

  if (name && name.trim() !== "") {
    filter = {
      userName: { $regex: name, $options: "i" },
    };
  }

  const users = await Users.find(filter)
    .select("_id userName userFullName profilePic")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return users;
};

const userProfileService = async (id) => {
  const user = await Users.findById(id).select("-userPassword");

  if (!user) {
    throw new Error("user not found");
  }

  return user;
};

module.exports = { fetchUsersService, userProfileService };
