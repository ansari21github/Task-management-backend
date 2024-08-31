import { body, validationResult } from 'express-validator';
// import { Request, Response, NextFunction } from 'express';

export const validateRegistration = [
    body('email').isString().isLength({ min: 3 }).withMessage('email must be at least 3 characters long'),
    body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (req: any, res: any, next: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
