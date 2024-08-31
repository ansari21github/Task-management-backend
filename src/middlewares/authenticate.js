"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    let token;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ message: 'Access token missing' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);
        const userId = decoded.id;
        if (!userId) {
            console.log('Token does not contain a user ID.');
            return res.status(400).json({ message: 'Invalid token payload' });
        }
        const user = yield User_1.default.findByPk(userId);
        if (!user) {
            console.log(`User with ID ${userId} not found in the database.`);
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user;
        console.log('User attached to request:', req.user);
        next();
    }
    catch (err) {
        console.error('Error during token verification:', err);
        return res.status(403).json({ message: 'Invalid access token' });
    }
});
exports.authenticateToken = authenticateToken;
