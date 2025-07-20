const { Schema, model } = require("mongoose");

const ResumeSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    experiences: [
      {
        company: String,
        position: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],
    projectsArray: [
      {
        title: String,
        duration: String,
        description: String,
      },
    ],
    languagesArray: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    hobbiesArray: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = model("resumes", ResumeSchema);
