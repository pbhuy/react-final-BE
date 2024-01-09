const { getIO } = require('../services/socket');
const { sendRes, sendErr } = require('../helpers/response');
const Notification = require('../models/notification.model');

module.exports = {
  sendNotification: (params) => {
    const { type } = params;
    const io = getIO();

    switch (type) {
      case 'create_review':
        const { receiver, sender } = params;
        if (!sender || !receiver) {
          console.error('Missing params');
          return;
        }
        io.to(receiver).emit('notification', {
          type,
          sender: sender.name,
        });
        break;
      case 'approve':
        break;
      case 'reject':
        break;
      case 'chat': {
        const { receiver, comment } = params;
        if (!receiver || !comment) {
          console.error('Missing params');
          return;
        }

        io.to(receiver).emit('notification', {
          type,
          sender: comment.account.name,
        });
        break;
      }
      default:
        break;
    }
  },
  getUserNotif: async (req, res) => {
    const { userid } = req.query;
    if (!userid) {
      return sendErr(res, 400, 'Missing params');
    }
    const notifications = await Notification.find({
      receiver: userid,
      isActive: false,
    })
      .populate({
        path: 'request',
        populate: {
          path: 'class',
          select: 'name',
        },
      })
      .populate({
        path: 'comment',
      })
      .sort({ createdAt: -1 });
    return sendRes(res, 200, notifications);
  },
};
