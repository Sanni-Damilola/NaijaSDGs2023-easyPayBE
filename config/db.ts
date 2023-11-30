import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB_URI: string = process.env.MongoDB_URL?.toString()!;
const LIVE_URI: string = process.env.DB_Connection_String?.toString()!;

const dbConfig = async () => {
  try {
    const connect = await mongoose.connect(DB_URI);
    console.log(`database is connected to ${connect.connection.host}`);
  } catch (error) {
    console.log(`unable to connect to database ${error}`);
  }
};

export default dbConfig;
