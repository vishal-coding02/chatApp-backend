const mongoose = require("mongoose");

const pushTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
    },
    tokens: [
      {
        fcmToken: {
          type: String,
          required: true,
        },

        device: {
          type: String,
          default: "unknown",
        },
      },
    ],
  },
  { timestamps: true },
);

const PushToken = mongoose.model("pushtokens", pushTokenSchema);
module.exports = PushToken;
