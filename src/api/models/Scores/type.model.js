const mongoose = require('mongoose');

const { Schema } = mongoose;

const TypeSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name of score type is required'],
        },
        percentage: {
            type: Number,
            default: 0.0,
        },
        class: {
            type: Schema.Types.ObjectId,
            ref: 'ClassRoom',
        },
        isPublish: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Type = mongoose.model('Type', TypeSchema);
module.exports = Type;
