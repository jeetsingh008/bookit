import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as bookingService from '../service/booking.service.js';

export const createBooking = asyncHandler(async (req, res) => {
  const { slotId, fullName, userEmail, promoCode } = req.body;

  
  if (!slotId || !fullName || !userEmail) {
    throw new ApiError(400, 'Slot ID, User Name, and User Email are required');
  }
  
  
  const newBooking = await bookingService.createNewBooking({
    slotId,
    fullName,
    userEmail,
    promoCode, 
  });

  
  return res
    .status(201) 
    .json(new ApiResponse(201, newBooking, 'Booking confirmed successfully'));
});