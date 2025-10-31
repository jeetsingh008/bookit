import { Experience } from '../models/experience.model.js';
import { Slot } from '../models/slot.model.js';
import { ApiError } from '../utils/ApiError.js';
import mongoose from 'mongoose';


export const fetchAllExperiences = async () => {
  try {

    const experiences = await Experience.find(
      {},
      'name location description price images duration' 
    ).lean();
    
    return experiences;
  } catch (error) {
    throw new ApiError(500, 'Error fetching experiences from database');
  }
};


export const fetchExperienceDetails = async (experienceId) => {
  console.log("EXPERIENCE ID IS : ",experienceId);
  
  if (!mongoose.Types.ObjectId.isValid(experienceId)) {
    throw new ApiError(400, 'Invalid experience ID format');
  }

  const experience = await Experience.findById(experienceId).lean();

  if (!experience) {
    throw new ApiError(404, 'Experience not found');
  }

  
  const availableSlots = await Slot.find({
    experience: experienceId,
    isSoldOut: false,
    startTime: { $gt: new Date() }, 
  })
  .sort({ startTime: 'asc' }) 
  .lean();

  
  return {
    ...experience,
    slots: availableSlots,
  };
};