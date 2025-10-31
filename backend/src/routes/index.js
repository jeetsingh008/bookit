import { Router } from "express";
import experienceRouter from "./experience.route.js";
import bookingRouter from "./bookings.route.js";
import promoRouter from "./promo.route.js";

const router = Router();

// Mount the feature routers
router.use("/experiences", experienceRouter); // All /experiences routes
router.use("/bookings", bookingRouter); // All /bookings routes
router.use("/promo", promoRouter); // All /promo routes

export default router;
