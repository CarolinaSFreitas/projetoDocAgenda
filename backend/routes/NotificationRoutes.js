const express = require("express");
const router = express.Router();
const {
  createNotification,
  getNotifications,
  updateNotificationStatus,
  deleteNotification,
} = require("../controllers/NotificationController");
const authGuard = require("../middlewares/authGuard");

router.post("/", authGuard, createNotification);
router.get("/", authGuard, getNotifications);
router.put("/:id", authGuard, updateNotificationStatus);
router.delete("/:id", authGuard, deleteNotification);

module.exports = router;
