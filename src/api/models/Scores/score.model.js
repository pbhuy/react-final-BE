const mongoose = require('mongoose');

const { Schema } = mongoose;

const scoreSchema = new Schema(
    {
        studentId: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
        },
        teacherId: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
        },
        typeId: {
            type: Schema.Types.ObjectId,
            ref: 'Type',
        },
        value: {
            type: Number,
            default: 0.0,
        },
    },
    { timestamps: true }
);

const Score = mongoose.model('Score', scoreSchema);
module.exports = Score;
