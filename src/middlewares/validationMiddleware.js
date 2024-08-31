"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegistration = void 0;
const express_validator_1 = require("express-validator");
// import { Request, Response, NextFunction } from 'express';
exports.validateRegistration = [
    (0, express_validator_1.body)('email').isString().isLength({ min: 3 }).withMessage('email must be at least 3 characters long'),
    (0, express_validator_1.body)('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
