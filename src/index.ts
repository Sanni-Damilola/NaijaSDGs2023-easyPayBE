import express, { Application, Request, Response } from "express";
import cors from "cors";
import dbConfig from "../config/db";

const PORT = process.env.PORT || 2023;

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
