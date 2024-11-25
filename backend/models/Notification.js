const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: { type: String, required: true },
  type: { type: String, required: true }, // e.g., "help_request"
  status: { type: String, default: "pending" }, // e.g., "pending", "accepted", "rejected"
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
