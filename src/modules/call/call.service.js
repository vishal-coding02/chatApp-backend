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

const missedCallsService = async (id) => {
  const user = await Users.findById(id);

  if (!user) {
    throw new Error("user not found");
  }

  const missCalls = await CallRecords.find({
    receiverId: id,
    callStatus: "missed",
  })
    .populate("callerId", "userFullName userName profilePic")
    .sort({ createdAt: -1 });

  if (missCalls.length === 0) {
    throw new Error("no misscalls found");
  }

  return missCalls;
};

module.exports = { addCallRecordService, missedCallsService };
