const mongoose = require('mongoose');

const { Schema } = mongoose;

const scoreSchema = new Schema(
    {
        studentId: {
            type: String,
            default: '',
        },
        teacherId: {
            type: String,
            default: '',
        },
        subjectId: {
            type: String,
            default: '',
        },
        scoreTypeId: {
            type: String,
            default: '',
        },
        semester: {
            type: String,
            default: '',
        },
        scoreValue: {
            type: Number,
            default: 0.0,
        },
    },
    { timestamps: true }
);

const Score = mongoose.model('Score', scoreSchema);
module.exports = Score;
