import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllVenues = async (req, res) => {
    try {
        const venues = await prisma.venue.findMany({
            where: { isActive: true },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json({ venues });
    } catch (error) {
        console.error('Get venues error:', error);
        res.status(500).json({ error: 'Failed to fetch venues' });
    }
};

export const getVenueById = async (req, res) => {
    try {
        const { id } = req.params;

        const venue = await prisma.venue.findUnique({
            where: { id },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                    },
                },
            },
        });

        if (!venue) {
            return res.status(404).json({ error: 'Venue not found' });
        }

        res.json({ venue });
    } catch (error) {
        console.error('Get venue error:', error);
        res.status(500).json({ error: 'Failed to fetch venue' });
    }
};

export const getMyVenues = async (req, res) => {
    try {
        const venues = await prisma.venue.findMany({
            where: { ownerId: req.user.id },
            orderBy: { createdAt: 'desc' },
        });

        res.json({ venues });
    } catch (error) {
        console.error('Get my venues error:', error);
        res.status(500).json({ error: 'Failed to fetch your venues' });
    }
};

export const createVenue = async (req, res) => {
    try {
        const {
            name,
            location,
            shortLocation,
            sport,
            type,
            price,
            priceUnit,
            image,
            images,
            about,
            facilities,
            availableSlots,
            openHours,
            contactPhone,
        } = req.body;


        if (!name || !location || !sport || !price) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['name', 'location', 'sport', 'price']
            });
        }

        const venue = await prisma.venue.create({
            data: {
                name,
                location,
                shortLocation: shortLocation || location,
                sport,
                type: type || 'Standard',
                price,
                priceUnit: priceUnit || '60 minutes',
                image: image || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800',
                images: images || [],
                about: about || 'A great venue for sports activities.',
                facilities: facilities || [],
                availableSlots: availableSlots || {},
                openHours: openHours || '6:00 AM - 11:00 PM',
                contactPhone,
                ownerId: req.user.id,
            },
        });

        await prisma.user.update({
            where: { id: req.user.id },
            data: { rewardPoints: { increment: 10 } }
        });

        res.status(201).json({
            message: 'Venue created successfully. You earned 10 reward points!',
            venue,
        });
    } catch (error) {
        console.error('Create venue error:', error);
        res.status(500).json({ error: 'Failed to create venue' });
    }
};

export const updateVenue = async (req, res) => {
    try {
        const { id } = req.params;


        const venue = await prisma.venue.findUnique({
            where: { id },
        });

        if (!venue) {
            return res.status(404).json({ error: 'Venue not found' });
        }

        if (venue.ownerId !== req.user.id) {
            return res.status(403).json({ error: 'You can only update your own venues' });
        }


        const updatedVenue = await prisma.venue.update({
            where: { id },
            data: req.body,
        });

        res.json({
            message: 'Venue updated successfully',
            venue: updatedVenue,
        });
    } catch (error) {
        console.error('Update venue error:', error);
        res.status(500).json({ error: 'Failed to update venue' });
    }
};

export const deleteVenue = async (req, res) => {
    try {
        const { id } = req.params;


        const venue = await prisma.venue.findUnique({
            where: { id },
        });

        if (!venue) {
            return res.status(404).json({ error: 'Venue not found' });
        }

        if (venue.ownerId !== req.user.id) {
            return res.status(403).json({ error: 'You can only delete your own venues' });
        }

        await prisma.venue.delete({
            where: { id },
        });

        res.json({ message: 'Venue deleted successfully' });
    } catch (error) {
        console.error('Delete venue error:', error);
        res.status(500).json({ error: 'Failed to delete venue' });
    }
};

export const getVenueBookings = async (req, res) => {
    try {
        const { id } = req.params;


        const venue = await prisma.venue.findUnique({
            where: { id },
        });

        if (!venue) {
            return res.status(404).json({ error: 'Venue not found' });
        }

        if (venue.ownerId !== req.user.id) {
            return res.status(403).json({ error: 'You can only view bookings for your own venues' });
        }

        const bookings = await prisma.booking.findMany({
            where: { venueId: id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json({ bookings });
    } catch (error) {
        console.error('Get venue bookings error:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};
