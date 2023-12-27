const mongoose = require('mongoose');

const { Schema } = mongoose;

const scoreSchema = new Schema(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
        },
        type: {
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
