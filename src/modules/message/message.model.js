const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    chatRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chatRoom",
      required: true,
      index: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

MessageSchema.index({ chatRoomId: 1, createdAt: -1 });

const Message = mongoose.model("message", MessageSchema);

module.exports = Message;
