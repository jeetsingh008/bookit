import { Router } from "express";

import {
  getExperiences,
  getExperienceById,
} from "../controllers/experience.controller.js";

const router = Router();

router.route("/").get(getExperiences);
router.route("/:id").get(getExperienceById);

export default router;
