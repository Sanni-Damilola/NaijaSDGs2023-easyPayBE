import mongoose from "mongoose";

const DB_URI = process.env.MongoDB_URL as String;
const LIVE_URI = process.env.DB_Connection_String?.toString();
console.log("here", DB_URI);

const dbConfig = async () => {
  // try {
  //   const connect = await mongoose.connect(DB_URI?.toString());
  //   console.log(`database is connected to ${connect.connection.host}`);
  // } catch (error) {
  //   console.log(`unable to connect to database ${error}`);
  // }
};

export default dbConfig;
