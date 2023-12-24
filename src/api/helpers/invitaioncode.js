const shortid = require('shortid');

const INVITATIONCODE_LENGTH = 8;

const generateInvitationCode = () => {
  return shortid.generate();;
};

module.exports = { generateInvitationCode };
