const mongoose = require('mongoose');

const { Schema } = mongoose;

const semesterSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name of semester is required'],
        },
    },
    { timestamps: true }
);

const Semester = mongoose.model('Semester', semesterSchema);
module.exports = Semester;
