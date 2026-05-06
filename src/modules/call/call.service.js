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
    deletedBy: [],
  });

  await callRecord.save();
  return callRecord;
};

const callsService = async ({ id, chatId }) => {
  const user = await Users.findById(id);

  if (!user) throw new Error("user not found");

  const query = {
    $or: [{ callerId: id }, { receiverId: id }],

    deletedBy: {
      $nin: [id],
    },
  };

  if (chatId) {
    query.chatId = chatId;
  }

  const callsHistory = await CallRecords.find(query)
    .populate("callerId", "userFullName userName profilePic")
    .populate("receiverId", "userFullName userName profilePic")
    .sort({ createdAt: -1 });

  if (callsHistory.length === 0) throw new Error("no calls found");

  return callsHistory;
};

const markCallsReadService = async (userId) => {
  await CallRecords.updateMany(
    { receiverId: userId, read: false },
    { $set: { read: true } },
  );
};

const removeCallLogService = async (id, callLogID) => {
  if (callLogID === "all") {
    await CallRecords.updateMany(
      {
        $or: [{ callerId: id }, { receiverId: id }],
        deletedBy: { $nin: [id] },
      },
      {
        $push: {
          deletedBy: id,
        },
      },
    );

    return {
      success: true,
      message: "All call logs removed",
    };
  }

  const callLog = await CallRecords.findById(callLogID);

  if (!callLog) {
    throw new Error("Call log not found");
  }

  const isUserPartOfCall =
    callLog.callerId.toString() === id || callLog.receiverId.toString() === id;

  if (!isUserPartOfCall) {
    throw new Error("Unauthorized");
  }

  if (!callLog.deletedBy.includes(id)) {
    callLog.deletedBy.push(id);
  }

  await callLog.save();

  return {
    success: true,
    message: "Call log removed successfully",
  };
};

module.exports = {
  addCallRecordService,
  callsService,
  markCallsReadService,
  removeCallLogService,
};
