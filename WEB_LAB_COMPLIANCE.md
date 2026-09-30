# Web Technology Lab — Compliance Map

## Experiment 1 — Bootstrap + client-side JavaScript validation
Route: `/register` (frontend)
File: `frontend/src/App.tsx` (Register component), `backend/src/models/User.js`, `backend/src/routes/auth.js`
The registration page uses Bootstrap 5 layout classes and inline `invalid-feedback` classes. JavaScript logic validates Name, Email, Mobile (10 digits), Password (strength/match), and Date of Birth (age>=5) before API submission. The backend also mirrors these validations.

## Experiment 2 — ES6 JavaScript
Route: `/experiments/2`
File: `frontend/src/Experiments.tsx`
The interactive experiment viewer successfully demonstrates Date objects, loops (Factorial), array generation and joining (Multiplication Table), map/reduce/filter loops, arrow functions, destructuring, the spread operator, `prompt()`, `confirm()`, and `alert()`. It includes an ES5 vs ES6 comparison table.

## Experiment 3 — React functional components, JSX, Props, State
Route: `/experiments/3`
File: `frontend/src/Experiments.tsx`
The experiment successfully implements reusable functional components (`StatCard`, `StudentBadge`) receiving data via props. It utilizes `useState` hooks to manage interactive states (counter, toggle switch) and provides a documented explanation of React's component tree and one-way data flow architecture.

## Experiment 4 — React Router + Hooks
Route: `/experiments/4`
File: `frontend/src/Experiments.tsx`
This experiment implements a mini Single Page Application (SPA) demonstrating nested React Router navigation (`/home`, `/about`, `/contact`) without page reloads. It also includes an interactive component mounter that demonstrates `useState`, `useEffect` (for mount, update, and cleanup), `useRef` (for focusing an input on load), and a legacy Class component showcasing `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` lifecycle methods.

## Experiment 5 — MongoDB
File: `backend/scripts/collegedb.mongosh.js` and `MONGODB_SETUP.md`
A dedicated MongoDB shell script demonstrates database instantiation, document insertions (5 records), targeted querying, updating a specific record, and deletion. `MONGODB_SETUP.md` provides execution instructions. In the app itself, Mongoose models persist CRUD data.

## Experiment 6 — Node + Express + Mongoose + MongoDB
File: `backend/src/models/Student.js` and `backend/src/server.js`
The `Student` model successfully implements strict schema validation (Regex matching, minlength/maxlength, required arrays with custom error messages) and demonstrates compound indexing (e.g., `{ batch: 1, studentCode: 1 }`, `{ batch: 1, status: 1 }`) as well as a text index for optimized queries. `server.js` wires the Mongoose connection and routes to the Express instance.

## Experiment 7 — Node core concepts
Files: `backend/src/node-demos/*.js` and `REPL.md`
The core Node.js concepts are separated into individual executables: `http-server.js` (Web Server), `event-loop.js` (Event Loop & Micro/Macro tasks), `fs-demo.js` (File System), `buffer-demo.js` (Buffers & Encoding), and `streams-demo.js` (Data Streams). Execute them via dedicated npm scripts (e.g., `npm run demo:http`). `REPL.md` documents how to use the interactive Node.js REPL.

## Experiment 8 — Express REST API + Postman
File: `postman/TuitionPro.postman_collection.json` and `README.md`
An expanded comprehensive Postman collection maps the entire REST API (Auth, Students, Courses, Batches, Attendance, Payments). The `README.md` clearly documents how to test these endpoints utilizing automatic HttpOnly cookie management.

## Experiment 9 — React + Express + MongoDB + Axios
File: `frontend/src/App.tsx` and `frontend/src/api.ts`
The frontend comprehensively utilizes `axios` to execute REST API calls to the Express backend. CRUD data is persisted efficiently in MongoDB. Crucially, strict and responsive React `loading` (using Bootstrap spinners) and `error` states have been uniformly implemented across all data pages (Dashboard, Students, Attendance, Payments) to guarantee a robust, professional user experience even on slow or failing networks.
See `DEPLOYMENT.md` for MongoDB Atlas + Render + Vercel deployment.

## Experiment 10 — MERN cloud deployment
Files: `DEPLOYMENT.md` and `frontend/vercel.json`
The project provides complete instructions for deploying to MongoDB Atlas (Database), Render (Node backend), and Vercel (React frontend). `frontend/vercel.json` includes strict configurations to manage SPA page reloads and seamlessly proxy backend API requests. `DEPLOYMENT.md` outlines a definitive pre-flight security checklist and an 8-step post-deploy smoke test to verify system integrity.
