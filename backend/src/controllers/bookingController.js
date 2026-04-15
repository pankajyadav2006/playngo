import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createBooking = async (req, res) => {
    try {
        if (req.user.role === 'PROVIDER') {
            return res.status(403).json({
                error: 'Providers cannot book venues. You can create and manage your own venues instead.'
            });
        }

        const {
            venueId,
            venueName,
            venueImage,
            date,
            time,
            duration,
            price,
        } = req.body;


        if (!venueId || !date || !time || !price) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['venueId', 'date', 'time', 'price']
            });
        }

        const booking = await prisma.booking.create({
            data: {
                userId: req.user.id,
                venueId,
                venueName,
                venueImage,
                date: new Date(date),
                time,
                duration: duration || '60 minutes',
                price,
                status: 'CONFIRMED',
            },
        });


        await prisma.user.update({
            where: { id: req.user.id },
            data: {
                totalBookings: { increment: 1 },
                rewardPoints: { increment: 10 }
            },
        });

        res.status(201).json({
            message: 'Booking created successfully. You earned 10 reward points!',
            booking,
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
};

export const getMyBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            where: { userId: req.user.id },
            include: {
                venue: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                        image: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json({ bookings });
    } catch (error) {
        console.error('Get my bookings error:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};

export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;


        const booking = await prisma.booking.findUnique({
            where: { id },
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.userId !== req.user.id) {
            return res.status(403).json({ error: 'You can only cancel your own bookings' });
        }

        if (booking.status === 'CANCELLED') {
            return res.status(400).json({ error: 'Booking already cancelled' });
        }

        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: {
                status: 'CANCELLED',
                cancelledAt: new Date(),
            },
        });

        res.json({
            message: 'Booking cancelled successfully',
            booking: updatedBooking,
        });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
};
