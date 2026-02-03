const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    lastMessage: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const ChatRoom = mongoose.model("chatRoom", ChatRoomSchema);

module.exports = ChatRoom;
