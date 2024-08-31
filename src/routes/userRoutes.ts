import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
// import { Request, Response } from 'express'; // Importing types from Express
import { validateRegistration } from '../middlewares/validationMiddleware'; // Import the validation middleware

const router = express.Router();

// User registration route
router.post('/register', validateRegistration, async (req: any, res: any) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error });
    }
});

// User login route
router.post('/login', async (req: any, res: any) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
                expiresIn: '1h',
            });
            res.json({ token });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error logging in', error });
    }
});

export default router;
