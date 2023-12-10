const mongoose = require("mongoose");
const { Schema } = mongoose;

const studentclass = new Schema(
  {
    studentId: {
      type: String,
      required: true,
    },
    classId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const StudentClass = mongoose.model("StudentClass", studentclass);
module.exports = StudentClass;
