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
const express_1 = __importDefault(require("express"));
const Task_1 = __importDefault(require("../models/Task"));
const authenticate_1 = require("../middlewares/authenticate");
const router = express_1.default.Router();
// Create a task
// Create a task
router.post('/', authenticate_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description } = req.body;
    try {
        // Check if req.user exists and has an id
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: 'User not found' });
        }
        // Create a new task associated with the authenticated user
        const task = yield Task_1.default.create({
            title,
            description,
            user_id: req.user.id, // Use req.user.id for the user ID
        });
        res.status(201).json(task);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating task', error });
    }
}));
// Read tasks
router.get('/', authenticate_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield Task_1.default.findAll({ where: { user_id: req.user.id } });
        res.json(tasks);
    }
    catch (error) {
        res.status(400).json({ message: 'Error fetching tasks', error });
    }
}));
// Update a task
router.put('/:id', authenticate_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
        const task = yield Task_1.default.findByPk(id);
        if (task) {
            task.title = title;
            task.description = description;
            yield task.save();
            res.json(task);
        }
        else {
            res.status(404).json({ message: 'Task not found' });
        }
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating task', error });
    }
}));
// Update only the status of a task
router.patch('/:id/status', authenticate_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body; // Expect status in the request body
    if (typeof status !== 'boolean') {
        return res.status(400).json({ message: 'Invalid status value' });
    }
    try {
        const task = yield Task_1.default.findByPk(id);
        if (task) {
            task.status = status;
            yield task.save();
            res.json(task);
        }
        else {
            res.status(404).json({ message: 'Task not found' });
        }
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating task status', error });
    }
}));
// Get all tasks with status true (completed)
router.get('/completed', authenticate_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield Task_1.default.findAll({
            where: {
                status: true, // Fetch tasks where status is true
            },
        });
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching completed tasks', error });
    }
}));
// Get all tasks with status false (pending)
router.get('/pending', authenticate_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield Task_1.default.findAll({
            where: {
                status: false, // Fetch tasks where status is false
            },
        });
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching pending tasks', error });
    }
}));
// Delete a task
router.delete('/:id', authenticate_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const task = yield Task_1.default.findByPk(id);
        if (task) {
            yield task.destroy();
            res.json({ message: 'Task deleted' });
        }
        else {
            res.status(404).json({ message: 'Task not found' });
        }
    }
    catch (error) {
        res.status(400).json({ message: 'Error deleting task', error });
    }
}));
exports.default = router;
