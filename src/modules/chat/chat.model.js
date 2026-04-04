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

    hasMessage: {
      type: Boolean,
      required: true,
    },

    lastMessageAt: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["pending", "active", "rejected"],
      default: "pending",
    },

    deletedBy: [
      { type: mongoose.Schema.Types.ObjectId, ref: "users", required: false },
    ],
  },
  { timestamps: true },
);

ChatRoomSchema.index({ participants: 1 });

ChatRoomSchema.index({ createdBy: 1, updatedAt: -1 });

ChatRoomSchema.index({ status: 1, updatedAt: -1, participants: 1 });

ChatRoomSchema.index({
  status: 1,
  hasMessage: 1,
  updatedAt: -1,
  participants: 1,
});

const ChatRoom = mongoose.model("chatRoom", ChatRoomSchema);

module.exports = ChatRoom;
