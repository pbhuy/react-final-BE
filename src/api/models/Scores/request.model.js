const mongoose = require('mongoose');

const { Schema } = mongoose;

const requestSchema = new Schema(
    {
        title: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
        },
        description: {
            type: String,
            required: [true, 'Content of comment is required'],
        },
        expectation: {
            type: Number,
            required: [true, 'Content of comment is required'],
        },
        studentId: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
        },
        teacherId: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
        },
        classId: {
            type: Schema.Types.ObjectId,
            ref: 'ClassRoom',
        },
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment',
            },
        ],
    },
    { timestamps: true }
);

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;
