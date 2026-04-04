const Users = require("../user/user.model");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../../libs/auth/JwtToken");
const cloudinary = require("../../libs/cloudinary");
const { sendEmail } = require("../../utils/Email");
const Token_EXPIRY_MINUTES = 5;

const signUpService = async (data) => {
  const { fullName, username, email, password, profilePic } = data;

  if (!fullName || !username || !email || !password) {
    throw new Error("Please fill in all required fields");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new Error("Please enter a valid email address");
  }

  const existingUser = await Users.findOne({
    $or: [{ userEmail: email }, { userName: username }],
  });

  if (existingUser) {
    if (existingUser.userEmail === email) {
      throw new Error("Email already registered");
    }
    if (existingUser.userName === username) {
      throw new Error("Username already taken");
    }
  }

  const hashPass = await bcrypt.hash(password, 10);

  let uploadedImage = null;
  if (profilePic) {
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "providers",
    });
    uploadedImage = uploadResponse.secure_url;
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + Token_EXPIRY_MINUTES);

  const user = await Users.create({
    userFullName: fullName,
    userName: username,
    userEmail: email,
    userPassword: hashPass,
    profilePic: uploadedImage || "",
    isVerified: false,
    verificationToken: hashedToken,
    tokenExpiry: expiryTime,
  });

  await sendEmail({
    toEmail: user.userEmail,
    userFullName: user.userFullName,
    token: verificationToken,
  });

  console.log("Email Sent Successfully");

  return true;
};

async function loginService(data, res) {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error("Please fill in all required fields");
  }

  const user = await Users.findOne({ userEmail: email }).select(
    "-createdAt -updatedAt",
  );

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.userPassword);
  if (!isMatch) throw new Error("Incorrect password");

  if (!user.isVerified) {
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + Token_EXPIRY_MINUTES);

    user.verificationToken = hashedToken;
    user.tokenExpiry = expiryTime;

    await user.save();

    await sendEmail({
      toEmail: user.userEmail,
      userFullName: user.userFullName,
      token: verificationToken,
    });

    throw new Error("Email not verified");
  }

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

const verifyEmailService = async (token) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await Users.findOne({
    verificationToken: hashedToken,
    tokenExpiry: { $gt: new Date() },
  }).select("userEmail");

  if (!user) {
    throw new Error("Invalid or Expired Token");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.tokenExpiry = undefined;

  await user.save();

  return user;
};

module.exports = { signUpService, loginService, verifyEmailService };
