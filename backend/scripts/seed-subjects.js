import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

// Simple inline models to avoid circular deps
const SubjectSchema = new mongoose.Schema({ name: String, code: String, description: String }, { timestamps: true });
const MaterialSchema = new mongoose.Schema({ subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }, title: String, type: String, link: String }, { timestamps: true });
const AssignmentSchema = new mongoose.Schema({ subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }, title: String, dueDate: Date, status: { type: String, default: 'Pending' } }, { timestamps: true });

const Subject = mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);
const Material = mongoose.models.Material || mongoose.model('Material', MaterialSchema);
const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema);

const subjects = [
  {
    name: 'Web Technology',
    code: 'IT501',
    description: 'HTML, CSS, JavaScript, React, Node.js and REST APIs',
    materials: [
      { title: 'HTML5 & CSS3 Complete Reference (MDN)', type: 'LINK', link: 'https://developer.mozilla.org/en-US/docs/Web' },
      { title: 'JavaScript: The Good Parts - Video Lecture', type: 'YouTube', link: 'https://www.youtube.com/watch?v=hQVTIJBZook' },
      { title: 'React Official Documentation', type: 'LINK', link: 'https://react.dev' },
      { title: 'Node.js + Express REST API Tutorial', type: 'YouTube', link: 'https://www.youtube.com/watch?v=ENrzD9HAZK4' },
      { title: 'Web Tech Lab Manual - Unit 1 (HTML Forms)', type: 'PDF', link: 'https://www.w3schools.com/html/html_forms.asp' },
    ],
    assignments: [
      { title: 'Build a Registration Form using HTML5 & CSS3', dueDate: new Date('2026-10-15'), status: 'Pending' },
      { title: 'Implement Client-Side Validation using JavaScript', dueDate: new Date('2026-10-22'), status: 'Pending' },
      { title: 'Create a Single Page App using React', dueDate: new Date('2026-11-01'), status: 'Pending' },
    ]
  },
  {
    name: 'Database Management Systems',
    code: 'IT502',
    description: 'SQL, NoSQL, MongoDB, transactions, normalization and indexing',
    materials: [
      { title: 'SQL Complete Tutorial (W3Schools)', type: 'LINK', link: 'https://www.w3schools.com/sql/' },
      { title: 'MongoDB University - Free Course', type: 'LINK', link: 'https://learn.mongodb.com' },
      { title: 'Database Normalization Explained', type: 'YouTube', link: 'https://www.youtube.com/watch?v=GFQaEYEc8_8' },
      { title: 'DBMS Notes - Unit 2 ER Diagrams (BVCOEIT)', type: 'PDF', link: 'https://www.javatpoint.com/dbms-er-model-concept' },
      { title: 'Transactions & ACID Properties - Lecture', type: 'YouTube', link: 'https://www.youtube.com/watch?v=pomxJOFVcQs' },
    ],
    assignments: [
      { title: 'Design ER Diagram for College Management System', dueDate: new Date('2026-10-12'), status: 'Pending' },
      { title: 'Implement SQL Queries for Library Database', dueDate: new Date('2026-10-25'), status: 'Completed' },
      { title: 'MongoDB CRUD Operations Lab Exercise', dueDate: new Date('2026-11-05'), status: 'Pending' },
    ]
  },
  {
    name: 'Computer Networks',
    code: 'IT503',
    description: 'OSI model, TCP/IP, routing algorithms, network security',
    materials: [
      { title: 'OSI Model Explained in 7 Minutes', type: 'YouTube', link: 'https://www.youtube.com/watch?v=vv4y_uOneC0' },
      { title: 'Cisco Networking Basics (Free Cisco Course)', type: 'LINK', link: 'https://www.netacad.com/courses/networking/networking-basics' },
      { title: 'TCP/IP Protocol Suite Notes', type: 'LINK', link: 'https://www.geeksforgeeks.org/tcp-ip-model/' },
      { title: 'Subnetting Practice Problems', type: 'LINK', link: 'https://subnettingpractice.com' },
      { title: 'Network Security Fundamentals - Lecture 5', type: 'YouTube', link: 'https://www.youtube.com/watch?v=E03gh1huvW4' },
    ],
    assignments: [
      { title: 'Simulate OSI Model using Cisco Packet Tracer', dueDate: new Date('2026-10-18'), status: 'Pending' },
      { title: 'Configure Static Routing and NAT', dueDate: new Date('2026-10-30'), status: 'Pending' },
    ]
  },
  {
    name: 'Software Engineering',
    code: 'IT504',
    description: 'SDLC models, agile methodology, testing and software project management',
    materials: [
      { title: 'Agile Manifesto & Scrum Guide', type: 'LINK', link: 'https://scrumguides.org' },
      { title: 'Software Testing Techniques - Crash Course', type: 'YouTube', link: 'https://www.youtube.com/watch?v=TDynSmrzpXw' },
      { title: 'UML Diagrams Complete Tutorial', type: 'LINK', link: 'https://www.tutorialspoint.com/uml/index.htm' },
      { title: 'SE Notes - Unit 1: SDLC Models', type: 'PDF', link: 'https://www.geeksforgeeks.org/software-development-life-cycle-sdlc/' },
    ],
    assignments: [
      { title: 'Draw UML Diagrams for Online Shopping System', dueDate: new Date('2026-10-20'), status: 'Pending' },
      { title: 'Write Test Cases for the Web Tech Lab Project', dueDate: new Date('2026-11-08'), status: 'Pending' },
    ]
  },
  {
    name: 'Theory of Computation',
    code: 'IT505',
    description: 'Automata theory, formal languages, Turing machines and complexity',
    materials: [
      { title: 'Finite Automata & Regular Expressions (Video)', type: 'YouTube', link: 'https://www.youtube.com/watch?v=9syvZr-9xwk' },
      { title: 'Context-Free Grammars Explained', type: 'YouTube', link: 'https://www.youtube.com/watch?v=5_tfVe7ED3g' },
      { title: 'TOC Notes - NFA to DFA Conversion', type: 'LINK', link: 'https://www.geeksforgeeks.org/conversion-from-nfa-to-dfa/' },
      { title: 'Pumping Lemma Practice Problems', type: 'LINK', link: 'https://www.tutorialspoint.com/automata_theory/pumping_lemma_for_cfl.htm' },
    ],
    assignments: [
      { title: 'Design DFA for strings ending with 01', dueDate: new Date('2026-10-14'), status: 'Completed' },
      { title: 'Prove a language is not regular using Pumping Lemma', dueDate: new Date('2026-10-28'), status: 'Pending' },
    ]
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  for (const s of subjects) {
    let subj = await Subject.findOne({ code: s.code });
    if (!subj) {
      subj = await Subject.create({ name: s.name, code: s.code, description: s.description });
      console.log(`Created subject: ${s.name}`);
    } else {
      console.log(`Subject already exists: ${s.name}`);
    }

    // Add materials if not present
    for (const m of s.materials) {
      const existing = await Material.findOne({ subject: subj._id, title: m.title });
      if (!existing) {
        await Material.create({ subject: subj._id, ...m });
        console.log(`  + Material: ${m.title}`);
      }
    }

    // Add assignments if not present
    for (const a of s.assignments) {
      const existing = await Assignment.findOne({ subject: subj._id, title: a.title });
      if (!existing) {
        await Assignment.create({ subject: subj._id, ...a });
        console.log(`  + Assignment: ${a.title}`);
      }
    }
  }

  console.log('\nSeeding complete!');
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
