import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as experienceService from "../service/experience.service.js";

export const getExperiences = asyncHandler(async (req, res) => {
  const experiences = await experienceService.fetchAllExperiences();

  return res
    .status(200)
    .json(
      new ApiResponse(200, experiences, "Experiences fetched successfully")
    );
});

export const getExperienceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Experience ID is required");
  }

  const experienceData = await experienceService.fetchExperienceDetails(id);

  if (!experienceData) {
    throw new ApiError(404, "Experience not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        experienceData,
        "Experience details fetched successfully"
      )
    );
});
