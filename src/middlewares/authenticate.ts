
import jwt from 'jsonwebtoken';
import User from '../models/User'; 


export const authenticateToken = async (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    let token;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }


    if (!token) {
        return res.status(401).json({ message: 'Access token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

       
        console.log('Decoded Token:', decoded);

        
        const userId = decoded.id;

        if (!userId) {
            console.log('Token does not contain a user ID.');
            return res.status(400).json({ message: 'Invalid token payload' });
        }

        
        const user = await User.findByPk(userId);

        if (!user) {
            console.log(`User with ID ${userId} not found in the database.`);
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user; 
        console.log('User attached to request:', req.user);
        next();
    } catch (err) {
        console.error('Error during token verification:', err);
        return res.status(403).json({ message: 'Invalid access token' });
    }
};
