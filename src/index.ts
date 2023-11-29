import express, { Application, Request, Response } from "express";
import cors from "cors";
import dbConfig from "../config/db";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT;

const app: Application = express();
dbConfig();
app.use(express.json());
app.use(cors());

//default get
app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "api is available for consumption testing ",
  });
});

//routes

app.listen(PORT, () => {
  console.log(`server is up on port ${PORT}`);
});
