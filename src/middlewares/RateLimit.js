const rateLimit = require("express-rate-limit");

const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: "Too many login attempts. Try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const signupLimit = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 10,
  message: {
    error: "Too many signup attempts. Try again after 30 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimit, signupLimit };
