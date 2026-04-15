import express from 'express';
import {
    createBooking,
    getMyBookings,
    cancelBooking,
} from '../controllers/bookingController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createBooking);
router.get('/my-bookings', authenticate, getMyBookings);
router.put('/:id/cancel', authenticate, cancelBooking);

export default router;
