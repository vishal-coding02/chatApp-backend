const Users = require("../../models/v1/users.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../../libs/auth/JwtToken");

const signUpService = async (data) => {
  const { fullname, username, email, password } = data;

  const existingUser = await Users.findOne({
    $or: [{ userEmail: email }],
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashPass = await bcrypt.hash(password, 10);

  const user = await Users.create({
    userFullName: fullname,
    userName: username,
    userEmail: email,
    userPassword: hashPass,
  });

  return user;
};

async function loginService(data, res) {
  const { email, password } = data;

  const user = await Users.findOne({ userEmail: email });

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.userPassword);
  if (!isMatch) throw new Error("Incorrect password");

  const { accessToken, refreshToken } = generateToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });

  return { accessToken, user };
}

module.exports = { signUpService, loginService };
