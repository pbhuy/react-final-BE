const mongoose = require('mongoose');

const { Schema } = mongoose;

const scoreStructureSchema = new Schema(
    {
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
        percentage: {
            type: Number,
            default: 0.0,
        },
        isPublish: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const ScoreStructure = mongoose.model('ScoreStructure', scoreStructureSchema);
module.exports = ScoreStructure;
