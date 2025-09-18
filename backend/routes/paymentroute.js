import express from "express";
import { paymentGateway, paymentLacture } from "../controllers/courseController.js";
import isAuth from "../middleware/isAuth.js";

const paymentRoute = express.Router();

paymentRoute.post("/create-payment-intent",isAuth, paymentGateway);
paymentRoute.post("/paymentLacture/:courseId",isAuth, paymentLacture);

export default paymentRoute;
