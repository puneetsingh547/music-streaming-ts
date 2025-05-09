import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timeseries: true,
  }
);

export const User = mongoose.model("User", schema);
