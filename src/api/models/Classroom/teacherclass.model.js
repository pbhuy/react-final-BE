const mongoose = require("mongoose");
const { Schema } = mongoose;

const teacherclass = new Schema(
  {
    teacherId: {
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

const TeacherClass = mongoose.model("TeacherClass", teacherclass);
module.exports = TeacherClass;
