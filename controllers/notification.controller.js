const { Notification } = require('../models');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'An error occurred while fetching notifications.' });
  }
};

const markAsRead = async (req, res) => {
  const { notificationId } = req.params;
  try {
    const notification = await Notification.findOne({
      where: { id: notificationId, userId: req.user.id },
    });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }
    notification.read = true;
    await notification.save();
    res.status(200).json({ message: 'Notification marked as read.' });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ message: 'An error occurred while marking the notification as read.' });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { read: true },
      { where: { userId: req.user.id, read: false } }
    );
    res.status(200).json({ message: 'All notifications marked as read.' });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ message: 'An error occurred while marking all notifications as read.' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
