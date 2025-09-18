
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors'
import Stripe from "stripe";

// local imports
import connectDB from "./config/connectdb.js";
import { authRouter } from "./routes/authroute.js";
import { userRoute } from "./routes/userRoute.js";
import { courseRoute } from "./routes/courseRoute.js";
import paymentRoute from "./routes/paymentroute.js";


const app = express();
dotenv.config();
app.use(express.json())
app.use(cookieParser())

app.use(cors({
   origin:'http://localhost:5173',
   credentials:true
}))


app.use("/api/auth", authRouter);
app.use("/api/user", userRoute);
app.use("/api/course", courseRoute);
app.use("/api/payment", paymentRoute);

// app.get('/', (req,res,next) => {
//    res.send("hello world");
// })

const port = process.env.PORT;
app.listen(port, () => {
    connectDB();
    console.log("Server is running")
})

