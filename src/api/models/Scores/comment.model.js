const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema(
    {
        accountId: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
        },
        requestId: {
            type: Schema.Types.ObjectId,
            ref: 'Request',
        },
        content: {
            type: String,
            required: [true, 'Content of comment is required'],
        },
    },
    { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
