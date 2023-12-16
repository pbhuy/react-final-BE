const mongoose = require('mongoose');

const { Schema } = mongoose;

const scoreRequestSchema = new Schema(
    {
        score: {
            type: Schema.Types.ObjectId,
            ref: 'Score',
            required: true
        },
        isAccepted: {
            type: Boolean,
            default: false,
            required: true
        },
        comments: {
            type: [Schema.Types.ObjectId],
            ref: 'Comment',
            required: true
        }
    },
    { timestamps: true }
);

const ScoreRequest = mongoose.model('ScoreRequest', scoreRequestSchema);
module.exports = ScoreRequest;
