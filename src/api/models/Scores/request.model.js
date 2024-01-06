const mongoose = require('mongoose');

const { Schema } = mongoose;

const requestSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Content of explain is required'],
    },
    explain: {
      type: String,
      required: [true, 'Content of explain is required'],
    },
    actualScore: {
      type: Number,
      required: [true, 'Actual score is required'],
    },
    expectedScore: {
      type: Number,
      required: [true, 'Expected score is required'],
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'ClassRoom',
    },
    score: {
      type: Schema.Types.ObjectId,
      ref: 'Score',
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true }
);

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;
