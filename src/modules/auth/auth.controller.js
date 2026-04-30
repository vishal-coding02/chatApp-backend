const {
  signUpService,
  loginService,
  verifyEmailService,
} = require("../auth/auth.service");

const signUpController = async (req, res) => {
  try {
    await signUpService(req.body);

    return res.status(201).json({
      success: true,
      message: "user created successfully",
    });
  } catch (err) {
    if (
      err.message === "Please fill in all required fields" ||
      err.message === "Please enter a valid email address"
    ) {
      return res.status(400).json({ success: false, error: err.message });
    }
    if (
      err.message === "Email already registered" ||
      err.message === "Username already taken"
    ) {
      return res.status(409).json({ success: false, error: err.message });
    }
    return res.status(500).json({ success: false, error: err.message });
  }
};

const loginController = async (req, res) => {
  try {
    const { user, accessToken } = await loginService(req.body, res);
    return res.status(200).json({
      accessToken,
      userData: user,
      isLoggedIn: true,
      message: "Login Successfull",
    });
  } catch (err) {
    if (err.message === "Please fill in all required fields") {
      return res.status(400).json({ success: false, error: err.message });
    }
    if (err.message === "User not found") {
      return res.status(404).json({ success: false, error: err.message });
    }
    if (err.message === "Incorrect password") {
      return res.status(401).json({ success: false, error: err.message });
    }

    if (err.message === "Email not verified") {
      return res.status(403).json({
        success: false,
        error: "Email not verified. Check your email.",
      });
    }

    return res.status(500).json({ success: false, error: err.message });
  }
};

async function logoutController(req, res) {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Logout failed" });
  }
}

const verifyEmailController = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await verifyEmailService(token);
    return res.status(200).json({
      success: true,
      message: "email verified successfully",
      user,
    });
  } catch (err) {
    if (err.message === "Invalid or Expired Token") {
      return res.status(400).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  signUpController,
  loginController,
  logoutController,
  verifyEmailController,
};
