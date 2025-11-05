import { Router } from "express";
import experienceRouter from "./experience.route.js";
import bookingRouter from "./bookings.route.js";
import promoRouter from "./promo.route.js";

const router = Router();

router.use("/experiences", experienceRouter);
router.use("/bookings", bookingRouter); 
router.use("/promo", promoRouter); 

export default router;
