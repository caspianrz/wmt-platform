import mongoose, { mongo } from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    originalImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Files",
      required: true,
    },
    stack: {
      type: Array,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);

const ProjectModel = mongoose.model("Projects", projectSchema);

export default ProjectModel;
