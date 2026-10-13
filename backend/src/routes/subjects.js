import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect, adminOnly } from '../middleware/auth.js';
import Subject from '../models/Subject.js';
import Material from '../models/Material.js';
import Assignment from '../models/Assignment.js';
import Student from '../models/Student.js';
import fs from 'fs';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    cb(null, true); // Allow any for demo purposes, could restrict types here
  }
});

router.get('/', protect, async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'student') {
      const student = await Student.findOne({
        $or: [
          { user: req.user.id },
          { email: req.user.email }
        ]
      }).populate('course batch');

      if (student) {
        const batchName = student.batch?.name || '';
        const courseName = student.course?.name || '';
        const courseCode = student.course?.code || '';
        const combined = `${batchName} ${courseName} ${courseCode}`;
        const match = combined.match(/\b(8|9|10)\b/) || combined.match(/CLS(\d+)/i);

        if (match) {
          const classNum = match[1];
          query = {
            $or: [
              { code: new RegExp(`^CLS${classNum}-`, 'i') },
              { name: new RegExp(`Class\\s*${classNum}\\b`, 'i') }
            ]
          };
        } else if (courseCode) {
          query = { code: new RegExp(`^${courseCode}-`, 'i') };
        }
      }
    } else if (req.query.class) {
      const classNum = String(req.query.class).replace(/[^0-9]/g, '');
      if (classNum) {
        query = {
          $or: [
            { code: new RegExp(`^CLS${classNum}-`, 'i') },
            { name: new RegExp(`Class\\s*${classNum}\\b`, 'i') }
          ]
        };
      }
    }

    const subjects = await Subject.find(query);
    const payload = await Promise.all(subjects.map(async (subj) => {
      const notes = await Material.find({ subject: subj._id });
      const assignments = await Assignment.find({ subject: subj._id });
      return { 
        id: subj._id, 
        name: subj.name, 
        code: subj.code, 
        notes: notes.map(n => ({ id: n._id, title: n.title, type: n.type, link: n.link })), 
        assignments: assignments.map(a => ({ id: a._id, title: a.title, due: new Date(a.dueDate).toLocaleDateString("en-US", {month:"short", day:"numeric", year:"numeric"}), status: a.status }))
      };
    }));
    res.json(payload);
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json(subject);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/materials', protect, adminOnly, upload.single('file'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, type, link } = req.body;
    let finalLink = link;
    let finalType = type || "FILE";
    
    if (req.file) {
      finalLink = `http://localhost:${process.env.PORT||5000}/uploads/${req.file.filename}`;
      const ext = path.extname(req.file.originalname).toUpperCase().replace('.', '');
      finalType = ext.length > 0 && ext.length <= 4 ? ext : "FILE";
    }

    if (!finalLink) return res.status(400).json({ message: 'Must provide a file or a link' });

    const material = await Material.create({
      subject: id,
      title: title || (req.file ? req.file.originalname : 'Untitled'),
      type: finalType,
      link: finalLink,
    });
    res.status(201).json(material);
  } catch (error) {
    next(error);
  }
});

export default router;
