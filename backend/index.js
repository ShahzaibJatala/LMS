import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors';

import connectDB from "./config/connectdb.js";
import { authRouter } from "./routes/authroute.js";
import { userRoute } from "./routes/userRoute.js";
import { courseRoute } from "./routes/courseRoute.js";
import paymentRoute from "./routes/paymentroute.js";

const app = express();
dotenv.config();

connectDB(); 

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  'https://lmsforstudents.netlify.app',
  'https://lms-lime-delta.vercel.app',
  'http://localhost:5173' 
];

app.use(cors({
   origin: function (origin, callback) {
     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
       callback(null, true);
     } else {
       callback(new Error('Not allowed by CORS'));
     }
   },
   credentials: true
}));

app.use("/api/auth", authRouter);
app.use("/api/user", userRoute);
app.use("/api/course", courseRoute);
app.use("/api/payment", paymentRoute);

app.get('/', (req, res) => {
    res.send("API is running...");
});

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app;
