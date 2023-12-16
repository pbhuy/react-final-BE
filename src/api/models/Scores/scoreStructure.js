const mongoose = require('mongoose');

const { Schema } = mongoose;

const scoreStructureSchema = new Schema(
    {
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
        percentage: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

const ScoreStructure = mongoose.model('ScoreStructure', scoreStructureSchema);
module.exports = ScoreStructure;
