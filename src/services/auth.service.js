const Users = require("../models/users.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../libs/auth/JwtToken");
const cloudinary = require("../libs/cloudinary");

const signUpService = async (data) => {
  const { fullname, username, email, password, profilePic } = data;

  const existingUser = await Users.findOne({
    $or: [{ userEmail: email }],
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashPass = await bcrypt.hash(password, 10);

  let uploadedImage = null;
  if (profilePic) {
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "providers",
    });
    uploadedImage = uploadResponse.secure_url;
  }

  const user = await Users.create({
    userFullName: fullname,
    userName: username,
    userEmail: email,
    userPassword: hashPass,
    profilePic: uploadedImage,
  });

  return true;
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
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.userPassword;

  return { accessToken, user: userWithoutPassword };
}

module.exports = { signUpService, loginService };
