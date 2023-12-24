const mongoose = require('mongoose');

const { Schema } = mongoose;

const scoreTypeSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name score is required']
        }
    },
    { timestamps: true }
);

const ScoreType = mongoose.model('ScoreType', scoreTypeSchema);
module.exports = ScoreType;
