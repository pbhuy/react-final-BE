const mongoose = require("mongoose");
const { Schema } = mongoose;

const classroom = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    invitationCode: {
      type: String,
      required: true,
      default: "",
    },
  },
  { timestamps: true }
);

const ClassRoom = mongoose.model("ClassRoom", classroom);
module.exports = ClassRoom;
