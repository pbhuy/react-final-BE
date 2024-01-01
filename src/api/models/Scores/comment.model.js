const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema(
    {
        account: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
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
