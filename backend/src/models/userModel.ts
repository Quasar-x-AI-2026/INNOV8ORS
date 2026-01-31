import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkUserId: { 
      type: String, 
      required: true, 
      unique: true,
      index: true 
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      required: true,
    },
    onboardingComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);