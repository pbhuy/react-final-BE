const mongoose = require('mongoose');

const { Schema } = mongoose;

const subjectSchema = new Schema(
    {
        name: {
            type: String,
            default: ''
        },
        teacherId: {
            type: String,
            default: ''
        },
        scoreTypeId: {
            type: String,
            default: ''
        },
        semesterId: {
            type: String,
            default: ''
        },
        scores: {
            type: [String],
            default: []
        },
        scoreStructureId: {
            type: String,
            default: ''
        },
        isFinished: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;
