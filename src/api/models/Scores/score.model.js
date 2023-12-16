const mongoose = require('mongoose');

const { Schema } = mongoose;

const scoreSchema = new Schema(
    {
        studentId: {
            type: String,
            required: true
        },
        teacherId: {
            type: String,
            required: true
        },
        subjectId: {
            type: String,
            required: true
        },
        scoreTypeId: {
            type: Schema.Types.ObjectId,
            ref: 'ScoreType',
            required: true
        },
        semester: {
            type: Schema.Types.ObjectId,
            ref: 'Semester',
            required: true
        },
        score: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

const Score = mongoose.model('Score', scoreSchema);
module.exports = Score;
