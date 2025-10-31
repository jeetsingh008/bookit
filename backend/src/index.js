import mongoose from "mongoose";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import app from "./app.js";
dotenv.config();

connectDB()
  .then(
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is listening to port : ${process.env.PORT}`);
    })
  )
  .catch((err) => console.log(err));
