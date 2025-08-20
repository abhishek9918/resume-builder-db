const Resume = require("../models/resumeSchema");
const mongodb = require("mongodb");
const { subscribe } = require("../routes/resumeRoutes");
const mongoose = require("mongoose");
const ObjectId = mongodb.ObjectId;

async function createOrUpdateResume(req, resp) {
  // const { _id, ...rest } = req.body;
  // console.log(_id);
  try {
    const { _id, ...rest } = req.body;

    if (_id) {
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

async function getAllUserResumes(req, resp) {
  try {
    // const userId = req.user.userId;
    //
    if (!userId) {
      return resp.status(400).send({
        success: false,
        message: "User ID not found in request",
      });
    }
    const resumes = await Resume.find({ userId: userId }).lean();

    return resp.status(200).send({
      success: true,
      message:
        resumes.length > 0
          ? "Resumes fetched successfully"
          : "No resumes found",
      data: resumes,
    });
  } catch (error) {
    return resp.status(500).send({
      success: false,
      message: "Internal Server Error",
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
  } catch (error) {
    resp.status(500).send({
      success: false,
      message: "Error deleting resume",
      error: error.message,
    });
  }
};

const duplcateResume = async (req, resp) => {
  // console.log(req.params.resumeId, "req.params._id");
  try {
    const resumeId = req.params.resumeId;
    if (!resumeId) {
      return resp.status(400).send({
        success: false,
        message: "Resume ID is required",
      });
    }
    const oldResume = await Resume.findById(resumeId);
    if (!oldResume) {
      return resp.status(404).send({
        success: false,
        message: "Resume not found",
      });
    }
    const newResume = new Resume({
      ...oldResume.toObject(),
      _id: undefined,
      resumeName: req.body.resumeName || oldResume.resumeName + " (Copy)",
      createdAt: new Date(),
    });

    // const savedNewResume = await newResume.save();

    await newResume.save();
    const allResumes = await Resume.find().sort({ _id: -1 });
    resp.json({
      success: true,
      message: "Resume duplicated successfully ✅",
      data: allResumes,
    });
  } catch (error) {
    resp.status(500).json({ success: false, message: error.message });
  }
};

// const getResumeByUserId = async (req, resp) => {
//   try {
//     const { userId } = req.params;
//     // ));
//     if (!userId) {
//       return resp.status(400).send({
//         message: "Invalid user ID format ❌",
//         success: false,
//       });
//     }
//
//     // const resume = await Resume.findById(userId);
//     const resumes = await Resume.find({
//       $or: [
//         { userId: mongoose.Types.ObjectId(userId.trim()) },
//         { userId: userId.trim() },
//       ],
//       S,
//     });
//
//     if (!resumes) {
//       return resp.status(404).send({
//         message: "Resume not found with this ID ❌",
//         success: false,
//       });
//     }

//     resp.status(200).send({
//       message: "Resume fetched successfully ✅",
//       success: true,
//       data: resumes,
//     });
//
//   } catch (err) {
//     console.error("Error fetching resume:", err);
//     resp.status(500).send({
//       message: "Internal server error ❌",
//       success: false,
//     });
//   }
// };

// const mongoose = require("mongoose");

const getResumeByUserId = async (req, resp) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId.trim())) {
      return resp.status(400).send({
        message: "Invalid user ID format ❌",
        success: false,
      });
    }

    const objectIdUser = new mongoose.Types.ObjectId(userId.trim());

    const resumes = await Resume.find({ userId: objectIdUser }).sort({
      createdAt: -1,
    });

    if (!resumes || resumes.length === 0) {
      return resp.status(404).send({
        message: "Resume not found with this ID ❌",
        success: false,
      });
    }

    return resp.status(200).send({
      message: "Resumes fetched successfully ✅",
      success: true,
      data: resumes,
    });
  } catch (err) {
    console.error("Error fetching resume:", err);
    return resp.status(500).send({
      message: "Internal server error ❌",
      success: false,
      error: err.message,
    });
  }
};

const deleteResume = async (req, resp) => {
  try {
    const { resumeId } = req.params;
    if (!resumeId) {
      return resp.status(400).send({
        success: false,
        message: "Provide a valid resume ID",
      });
    }
    const result = await Resume.deleteOne({ _id: resumeId });

    if (result.deletedCount === 0) {
      return resp.status(404).send({
        success: false,
        message: "Resume not found ❌",
      });
    }

    return resp.status(200).send({
      success: true,
      message: "Resume deleted successfully ✅",
    });
  } catch (err) {
    return resp.status(501).send({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = {
  createOrUpdateResume,
  getResumeById,
  resumeDeleteById,
  getAllUserResumes,
  getResumeByUserId,
  duplcateResume,
  deleteResume,
};
