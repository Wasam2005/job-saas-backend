import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    organizationId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Organization",
  required: true,
  index: true,
},

    role: {
      type: String,
      enum: ["owner", "admin", "recruiter", "interviewer"],
      default: "recruiter",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
