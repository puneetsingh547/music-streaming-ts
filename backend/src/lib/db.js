import mongoose from "mongoose";

export async function connectionDB() {
  try {
    const con = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected...");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
