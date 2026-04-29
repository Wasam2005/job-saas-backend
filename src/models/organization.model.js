import mongoose from "mongoose";

const { Schema } = mongoose;

const organizationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    companyDomain: {
     type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Organization", organizationSchema);