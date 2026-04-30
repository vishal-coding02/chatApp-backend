const CallRecords = require("../call/call.model");
const Users = require("../user/user.model");

const addCallRecordService = async (records) => {
  const { chatId, callerId, receiverId, callDuration, callType, callStatus } =
    records;

  const callRecord = new CallRecords({
    chatId,
    callerId,
    receiverId,
    callDuration: callDuration || 0,
    callType: callType || "audio",
    callStatus,
  });

  await callRecord.save();
  return callRecord;
};

const callsService = async (id) => {
  const user = await Users.findById(id);

  if (!user) {
    throw new Error("user not found");
  }

  const callsHistory = await CallRecords.find({
    $or: [{ callerId: id }, { receiverId: id }],
  })
    .populate("callerId", "userFullName userName profilePic")
    .populate("receiverId", "userFullName userName profilePic")
    .sort({ createdAt: -1 });

  if (callsHistory.length === 0) {
    throw new Error("no calls found");
  }

  return callsHistory;
};

const markCallsReadService = async (userId) => {
  await CallRecords.updateMany(
    { receiverId: userId, read: false },
    { $set: { read: true } },
  );
};

module.exports = { addCallRecordService, callsService, markCallsReadService };
