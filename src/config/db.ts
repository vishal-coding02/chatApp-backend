import mongoose from "mongoose";

async function connectDB() {
  const mongoURI = process.env.MONGODB_URL;

  if (!mongoURI) {
    throw new Error("MONGODB_URL is missing");
  }

  try {
    await mongoose.connect(mongoURI, { family: 4 });
    console.log("Connected to MongoDB");
  } catch (error: any) {
    console.error("MongoDB connection error:", error.message);
  }
}

export { connectDB };
