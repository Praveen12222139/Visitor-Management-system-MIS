import { configDotenv } from "dotenv";
import mongoose from "mongoose";
configDotenv();
const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB");
    await mongoose.connect(
      "mongodb+srv://praveen12222139:Pk248408@cluster0.ts0ys.mongodb.net/MIS?retryWrites=true&w=majority&appName=Cluster0",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    );
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection failed");
  }
};

export default connectDB;
