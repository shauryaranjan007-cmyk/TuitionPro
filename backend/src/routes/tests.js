import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import Test from '../models/Test.js';
import Mark from '../models/Mark.js';
import Subject from '../models/Subject.js';
import Student from '../models/Student.js';

const router = express.Router();

router.get('/', protect, async (req, res, next) => {
  try {
    const tests = await Test.find().populate('subject', 'name');
    res.json(tests);
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const test = await Test.create(req.body);
    res.status(201).json(test);
  } catch (error) {
    next(error);
  }
});

// Admin posts marks
router.post('/:id/marks', protect, adminOnly, async (req, res, next) => {
  try {
    const { studentId, marks } = req.body;
    // Find or update mark
    const mark = await Mark.findOneAndUpdate(
      { test: req.params.id, student: studentId },
      { marks },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(mark);
  } catch (error) {
    next(error);
  }
});

// Get marks
router.get('/marks', protect, async (req, res, next) => {
  try {
    let query = {};
    // Students only see their own marks
    if (req.user.role === 'student') {
      const student = await Student.findOne({ email: req.user.email });
      if (student) query.student = student._id;
      else return res.json([]);
    }
    
    const marks = await Mark.find(query).populate('test').populate('student', 'name');
    res.json(marks);
  } catch (error) {
    next(error);
  }
});

export default router;
