const { getIO } = require('../services/socket');
const { sendRes, sendErr } = require('../helpers/response');
const Notification = require('../models/notification.model');
const StudentClass = require('../models/Classroom/studentclass.model');

module.exports = {
  sendNotification: (params) => {
    const { type } = params;
    const io = getIO();

    switch (type) {
      case 'create_review':
      case 'reject':
      case 'approve':
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
      case 'publish': {
        const { receiver, scoreType } = params;
        receiver.forEach((studentId) => {
          io.to(studentId).emit('notification', {
            type,
            scoreType: {
              name: scoreType.name,
              class: scoreType.class.name,
            },
          });
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
    const directNotifications = await Notification.find({
      receiver: userid,
      isActive: false,
    })
      .populate({
        path: 'request',
        populate: {
          path: 'class student teacher',
          select: 'name',
        },
      })
      .populate({
        path: 'comment',
      })
      .sort({ createdAt: -1 });

    const classes = await StudentClass.find({ studentId: userid });
    const classesId = classes.map((c) => c.classId);
    let classNotifications = await Notification.find({
      receiver: { $in: classesId },
    })
      .populate({
        path: 'request',
        populate: {
          path: 'class student teacher',
          select: 'name',
        },
      })
      .populate({
        path: 'scoreType', // Assuming scoreType is a field in Notification model
        populate: {
          path: 'class',
          select: 'name',
        },
      })
      .sort({ createdAt: -1 });

    // scoreType is null if the score composition is remove by teacher
    classNotifications = classNotifications.filter((n) => n.scoreType);

    const combinedNotifications =
      directNotifications.concat(classNotifications);
    combinedNotifications.sort((a, b) => b.createdAt - a.createdAt);

    return sendRes(res, 200, combinedNotifications);
  },
};
