import express from 'express';
import {
    getAllVenues,
    getVenueById,
    getMyVenues,
    createVenue,
    updateVenue,
    deleteVenue,
    getVenueBookings,
} from '../controllers/venueController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleAuth.js';

const router = express.Router();

router.get('/', getAllVenues);
router.get('/:id', getVenueById);

router.get('/my-venues/list', authenticate, requireRole(['PROVIDER', 'ADMIN']), getMyVenues);
router.post('/', authenticate, requireRole(['PROVIDER', 'ADMIN']), createVenue);
router.put('/:id', authenticate, requireRole(['PROVIDER', 'ADMIN']), updateVenue);
router.delete('/:id', authenticate, requireRole(['PROVIDER', 'ADMIN']), deleteVenue);
router.get('/:id/bookings', authenticate, requireRole(['PROVIDER', 'ADMIN']), getVenueBookings);

export default router;
