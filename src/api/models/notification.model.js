const mongoose = require('mongoose');

const { Schema } = mongoose;

const notifSchema = new Schema(
  {
    request: {
      type: Schema.Types.ObjectId,
      ref: 'Request',
    },
    receiver: {
      type: String,
      required: [true, 'Receiver of notification is required'],
    },
    type: {
      type: String,
      enum: ['create', 'approve', 'reject', 'chat', 'publish'],
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    scoreType: {
      type: Schema.Types.ObjectId,
      ref: 'Type',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notifSchema);
module.exports = Notification;
