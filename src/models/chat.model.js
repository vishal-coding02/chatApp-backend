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
      index: true,
    },

    lastMessage: {
      type: String,
      default: "",
    },

    hasMessage:{
      type : Boolean,
      required : true
    },

    lastMessageAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "active", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const ChatRoom = mongoose.model("chatRoom", ChatRoomSchema);

module.exports = ChatRoom;
