import express from 'express';
import Task from '../models/Task';
import { authenticateToken } from '../middlewares/authenticate';

const router = express.Router();

// Create a task
router.post('/', authenticateToken, async (req: any, res: any) => {
    const { title, description } = req.body;
    try {
        // Check if req.user exists and has an id
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Create a new task associated with the authenticated user
        const task = await Task.create({
            title,
            description,
            user_id: req.user.id, // Use req.user.id for the user ID
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: 'Error creating task', error });
    }
});

// Read tasks
router.get('/', authenticateToken, async (req: any, res: any) => {
    try {
        const tasks = await Task.findAll({ where: { user_id: req.user.id } });
        res.json(tasks);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching tasks', error });
    }
});

// Update a task
router.put('/:id', authenticateToken, async (req: any, res: any) => {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
        const task = await Task.findByPk(id);
        if (task) {
            task.title = title;
            task.description = description;
            await task.save();
            res.json(task);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error updating task', error });
    }
});

// Update only the status of a task
router.patch('/:id/status', authenticateToken, async (req: any, res: any) => {
    const { id } = req.params;
    const { status } = req.body; // Expect status in the request body

    if (typeof status !== 'boolean') {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    try {
        const task = await Task.findByPk(id);
        if (task) {
            task.status = status;
            await task.save();
            res.json(task);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error updating task status', error });
    }
});


// Get all tasks with status true (completed)
router.get('/completed', authenticateToken, async (req: any, res: any) => {
    try {
        const tasks = await Task.findAll({
            where: {
                user_id: req.user.id,
                status: true, // Fetch tasks where status is true
            },
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching completed tasks', error });
    }
});

// Get all tasks with status false (pending)
router.get('/pending', authenticateToken, async (req: any, res: any) => {
    try {
        const tasks = await Task.findAll({
            where: {
                user_id: req.user.id,
                status: false, // Fetch tasks where status is false
            },
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending tasks', error });
    }
});

// Delete a task
router.delete('/:id', authenticateToken, async (req: any, res: any) => {
    const { id } = req.params;
    try {
        const task = await Task.findByPk(id);
        if (task) {
            await task.destroy();
            res.json({ message: 'Task deleted' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error deleting task', error });
    }
});

export default router;