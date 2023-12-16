const mongoose = require('mongoose');

const { Schema } = mongoose;

const subjectSchema = new Schema(
    {
        teacherId: {
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
        scores: {
            type: [Schema.Types.ObjectId],
            ref: 'Score',
            required: true
        },
        structure: {
            type: Schema.Types.ScoreStructure,
            ref: 'ScoreStructure',
            required: true
        },
        isFinished: {
            type: Boolean,
            required: true
        }
    },
    { timestamps: true }
);

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;
