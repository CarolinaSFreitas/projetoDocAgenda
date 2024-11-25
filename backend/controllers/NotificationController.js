const Assistente = require("../models/Assistente");
const Notification = require("../models/Notification");

const createNotification = async (req, res) => {
  const { receiverId, type } = req.body;
  const senderId = req.assistente._id;

  const assistente = await Assistente.findById(senderId);

  try {
    const notification = await Notification.create({
      senderId,
      receiverId,
      message: `${assistente.name} solicitou o acesso ao seu sistema.`,
      type,
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    await Notification.findByIdAndDelete(id);
    res.status(200).json({ message: "Notificação deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNotifications = async (req, res) => {
  const userId = req?.user?._id;

  try {
    const notifications = await Notification.find({ receiverId: userId });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateNotificationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const notification = await Notification.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  updateNotificationStatus,
  deleteNotification,
};
