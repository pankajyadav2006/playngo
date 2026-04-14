import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../utils/jwt.js';

const prisma = new PrismaClient();

export const authenticate = async (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.substring(7);


        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }


        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
                role: true,
                totalBookings: true,
                rewardPoints: true,
                isEmailVerified: true,
                joinedDate: true,
            },
        });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }


        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};
