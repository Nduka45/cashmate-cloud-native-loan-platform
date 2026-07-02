const Notification = require('../models/notification.model');

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.findAll();

    res.status(200).json({
      notifications,
    });
  } catch (err) {
    next(err);
  }
};