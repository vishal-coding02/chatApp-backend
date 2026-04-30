const mongoose = require("mongoose");

const callRecordSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chatRoom",
      required: true,
    },
    callerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    callStatus: {
      type: String,
      enum: ["missed", "received", "rejected", "busy"],
      required: true,
    },
    callType: {
      type: String,
      enum: ["audio", "video"],
      default: "audio",
    },
    callDuration: {
      type: Number,
      default: 0,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

callRecordSchema.index({ receiverId: 1, createdAt: -1 });
callRecordSchema.index({ chatId: 1, createdAt: -1 });
callRecordSchema.index({ receiverId: 1, read: 1 });

const CallRecords = mongoose.model("callrecords", callRecordSchema);

module.exports = CallRecords;
