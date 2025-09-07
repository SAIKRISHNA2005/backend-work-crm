import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db";

dotenv.config();

const app = express();

app.use(express.json());


app.get("/", (req: Request, res: Response): void => {
  res.send("Hello World!");
});
app.get("/home", (req: Request, res: Response): void => {
  res.send("Welcome to the Home Page!");
});

connectDB();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
