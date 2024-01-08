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
      enum: ['create', 'approve', 'reject', 'chat'],
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
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
