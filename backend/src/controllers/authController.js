import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';

const prisma = new PrismaClient();

export const register = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;


        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }


        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone: phone || null,
                role: role || 'USER',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=B8FF3C&color=1A1D29&size=200`,
            },
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


        const token = generateToken(user.id);

        res.status(201).json({
            message: 'User registered successfully',
            user,
            token,
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }


        const user = await prisma.user.findUnique({
            where: { email },
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
                password: true,
            },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }


        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }


        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });


        const token = generateToken(user.id);


        const { password: _, ...userWithoutPassword } = user;

        res.json({
            message: 'Login successful',
            user: userWithoutPassword,
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

export const getCurrentUser = async (req, res) => {
    try {

        res.json({ user: req.user });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
};

export const logout = async (req, res) => {
    try {

        res.json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, avatar } = req.body;

        // Only include fields that are provided
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;
        if (avatar !== undefined) updateData.avatar = avatar;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
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

        res.json({
            message: 'Profile updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Update profile error:', error.message);
        console.error('Update profile full error:', error);
        res.status(500).json({ error: 'Failed to update profile', details: error.message });
    }
};
