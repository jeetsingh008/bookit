import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as bookingService from '../service/booking.service.js';

export const createBooking = asyncHandler(async (req, res) => {
  const { slotId, fullName, userEmail, promoCode } = req.body;

  // 1. Basic validation
  // (In a real app, a Zod schema would validate this)
  if (!slotId || !fullName || !userEmail) {
    throw new ApiError(400, 'Slot ID, User Name, and User Email are required');
  }
  
  // 2. Delegate the entire complex booking logic to the service
  const newBooking = await bookingService.createNewBooking({
    slotId,
    fullName,
    userEmail,
    promoCode, // The service will handle if this is null/undefined
  });

  // 3. Send the "Created" response
  return res
    .status(201) // 201 Created is more semantic for a successful POST
    .json(new ApiResponse(201, newBooking, 'Booking confirmed successfully'));
});