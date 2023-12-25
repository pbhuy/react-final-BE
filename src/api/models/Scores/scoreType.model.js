const mongoose = require('mongoose');

const { Schema } = mongoose;

const scoreTypeSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: [true, 'Name of score type is required'],
        },
    },
    { timestamps: true }
);

const ScoreType = mongoose.model('ScoreType', scoreTypeSchema);
module.exports = ScoreType;
