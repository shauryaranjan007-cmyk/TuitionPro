import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const SubjectSchema = new mongoose.Schema({ name: String, code: String }, { timestamps: true });
const BatchSchema = new mongoose.Schema({ name: String }, { timestamps: true });
const TestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  batch: { type: String, required: true },
  date: { type: Date, required: true },
  maxMarks: { type: Number, required: true }
}, { timestamps: true });

const Subject = mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);
const Batch = mongoose.models.Batch || mongoose.model('Batch', BatchSchema);
const Test = mongoose.models.Test || mongoose.model('Test', TestSchema);

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const subjects = await Subject.find();
  if (subjects.length === 0) {
    console.log('No subjects found! Please run seed-subjects.js first.');
    await mongoose.disconnect();
    return;
  }

  const batches = await Batch.find();

  const getSubject = (code) => subjects.find(s => s.code === code) || subjects[0];
  const batchName = batches.length > 0 ? batches[0].name : 'IT-A';

  const tests = [
    { name: 'Unit Test 1 - HTML & CSS', subject: getSubject('IT501')._id, batch: batchName, date: new Date('2026-09-05'), maxMarks: 20 },
    { name: 'Unit Test 1 - SQL Basics', subject: getSubject('IT502')._id, batch: batchName, date: new Date('2026-09-07'), maxMarks: 20 },
    { name: 'Unit Test 1 - OSI Model', subject: getSubject('IT503')._id, batch: batchName, date: new Date('2026-09-10'), maxMarks: 20 },
    { name: 'Unit Test 1 - SDLC Models', subject: getSubject('IT504')._id, batch: batchName, date: new Date('2026-09-12'), maxMarks: 20 },
    { name: 'Unit Test 1 - DFA & NFA', subject: getSubject('IT505')._id, batch: batchName, date: new Date('2026-09-14'), maxMarks: 20 },
    { name: 'Unit Test 2 - JavaScript & React', subject: getSubject('IT501')._id, batch: batchName, date: new Date('2026-10-01'), maxMarks: 30 },
    { name: 'Unit Test 2 - MongoDB & NoSQL', subject: getSubject('IT502')._id, batch: batchName, date: new Date('2026-10-03'), maxMarks: 30 },
    { name: 'Mid-Sem Exam - Web Technology', subject: getSubject('IT501')._id, batch: batchName, date: new Date('2026-10-20'), maxMarks: 50 },
    { name: 'Mid-Sem Exam - DBMS', subject: getSubject('IT502')._id, batch: batchName, date: new Date('2026-10-22'), maxMarks: 50 },
    { name: 'Lab Test 1 - HTML Forms', subject: getSubject('IT501')._id, batch: batchName, date: new Date('2026-09-20'), maxMarks: 25 },
  ];

  let created = 0;
  for (const t of tests) {
    const existing = await Test.findOne({ name: t.name, subject: t.subject });
    if (!existing) {
      await Test.create(t);
      console.log(`+ Test: ${t.name} (max: ${t.maxMarks})`);
      created++;
    } else {
      console.log(`Already exists: ${t.name}`);
    }
  }

  console.log(`\nDone! Created ${created} tests.`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
