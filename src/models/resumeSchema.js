const { Schema, model } = require("mongoose");

const ResumeSchema = new Schema(
  {
    resumeName: {
      type: String,
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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

    projectsArray: [
      {
        title: String,
        duration: String,
        description: String,
      },
    ],
    experiencesArray: [
      {
        company: String,
        position: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],
    educationsArray: [
      {
        institution: String,
        degree: String,
        startDate: String,
        endDate: String,
      },
    ],
    languagesArray: [{ language: String, level: String }],

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
