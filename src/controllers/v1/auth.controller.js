const {
  signUpService,
  loginService,
} = require("../../services/v1/auth.service");

const signUpController = async (req, res) => {
  try {
    const user = await signUpService(req.body);

    return res.status(201).json({
      success: true,
      message: "user created successfully",
      userData: user,
    });
  } catch (err) {
    if (err.message === "User already exists") {
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
    if (err.message === "User not found") {
      return res.status(404).json({ success: false, error: err.message });
    }
    if (err.message === "Incorrect password") {
      return res.status(401).json({ success: false, error: err.message });
    }

    return res.staus(500).json({ success: false, error: err.message });
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

module.exports = { signUpController, loginController, logoutController };
