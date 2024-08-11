import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(String(process.env.MONGO_URI));
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default dbConnect;
