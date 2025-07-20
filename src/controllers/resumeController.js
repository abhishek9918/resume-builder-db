const Resume = require("../models/resumeSchema");
const mongodb = require("mongodb");

const ObjectId = mongodb.ObjectId;

// async function createOrUpdateResume(req, resp) {
//   try {
//     const { _id, rest } = req.body;

//     if (_id) {
//       const updated = await Resume.findByIdAndUpdate(
//         _id,
//         { $rest: rest },
//         { new: true }
//       );
//       if (!updated) {
//         return resp.status(404).send({
//           success: false,
//           message: "Resume not found for update",
//         });
//       }
//       const newResume = new Resume(req.body);
//       await newResume.save();

//       return resp.status(201).json({
//         success: true,
//         message: "Resume created successfully",
//         data: newResume,
//       });
//     }
//   } catch (error) {
//     return resp.status(500).json({
//       success: false,
//       message: "Server Error",
//       error: error.message,
//     });
//   }
// }
async function createOrUpdateResume(req, resp) {
  try {
    const { _id, ...rest } = req.body;

    if (_id) {
      // Update if _id is present
      const updated = await Resume.findByIdAndUpdate(_id, rest, { new: true });
      if (!updated) {
        return resp.status(404).send({
          success: false,
          message: "Resume not found for update",
        });
      }
      return resp.status(200).json({
        success: true,
        message: "Resume updated successfully",
        data: updated,
      });
    }

    // Create new resume
    const newResume = new Resume(req.body);
    await newResume.save();
    return resp.status(201).json({
      success: true,
      message: "Resume created successfully",
      data: newResume,
    });
  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}

const getResumeById = async (req, resp) => {
  try {
    const { resumeId } = req.params;
    if (!resumeId) {
      return resp.status(200).send({
        success: false,
        message: "No resumeId found!!",
      });
    }
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return resp.status(200).send({
        message: "No Data found with this Id !!",
        success: false,
      });
    }
    return resp.status(201).send({
      success: true,
      message: "Resume fetched successfully.",
      data: resume,
    });
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const resumeDeleteById = async (req, resp) => {
  try {
    const { resumeId } = req.params;
    if (!resumeId) {
      resp.status(401).send({
        success: false,
        // message: `  ${resumeId}`
        message: " Id not found !!",
      });
    }
    const resume = await Resume.deleteOne({
      _id: new ObjectId(resumeId),
    });

    if (resume.deletedCount === 0) {
      return resp.status(404).json({
        success: false,
        message: "Resume not found!",
      });
    }
    resp.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
    console.log();
  } catch (error) {
    resp.status(500).send({
      success: false,
      message: "Error deleting resume",
      error: error.message,
    });
  }
};

module.exports = { createOrUpdateResume, getResumeById, resumeDeleteById };
