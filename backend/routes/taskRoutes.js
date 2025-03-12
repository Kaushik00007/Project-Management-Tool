import express from 'express';
import Task from '../models/Task.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route POST /api/tasks
 * @desc Create a new task
 * @access Private
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    let { title, description, dueDate, status } = req.body;

    if (!title || !description || !dueDate) {
      return res.status(400).json({ error: "Title, description, and due date are required" });
    }

    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate.getTime())) {
      return res.status(400).json({ error: "Invalid due date format" });
    }

    const validStatuses = ['To Do', 'In Progress', 'Done'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status value. Allowed values: ${validStatuses.join(', ')}` });
    }

    title = title.trim();
    description = description.trim();

    const task = new Task({
      title,
      description,
      dueDate: parsedDueDate,
      status: status || 'To Do',
      userId: req.user.id,
    });

    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (err) {
    console.error("Task Creation Error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

/**
 * @route GET /api/tasks
 * @desc Get all tasks for the logged-in user
 * @access Private
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id })
      .select('title description dueDate status') 
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (err) {
    console.error("Fetch Tasks Error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

export default router;
