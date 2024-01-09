const { getIO } = require('../services/socket');
const { sendRes, sendErr } = require('../helpers/response');

module.exports = {
  sendNotification: (params) => {
    const { type } = params;
    const io = getIO();

    switch (type) {
      case 'create':
        break;
      case 'approve':
        break;
      case 'reject':
        break;
      case 'chat': {
        const { request, receiver, comment } = params;

        if (!request || !receiver || !comment) {
          console.eror('Missing params');
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
  getUserNotif: async (req, res) => {},
};
