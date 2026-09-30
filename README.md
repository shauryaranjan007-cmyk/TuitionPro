# TuitionPro Pro — MERN + Web Technology Lab

A feature-rich TuitionPro management system designed to preserve the 10 Web Technology Lab requirements while adding:
- animated responsive UI
- dashboard analytics
- fee/payment management with demo mode and optional Razorpay
- AI assistant with optional Gemini API and safe local fallback
- Gmail integration with optional Gmail API / SMTP configuration and safe demo mode
- attendance management with percentage, late/absent tracking, date filtering and summaries
- student/course/batch CRUD
- JWT + bcrypt authentication
- REST API + Postman collection
- Node core module demonstration
- experiment center for all 10 lab experiments

## Architecture
React + Vite + TypeScript
        ↓ Axios
Node.js + Express
        ↓ Mongoose
MongoDB / MongoDB Atlas

Advanced integrations are feature-flagged:
- No AI key → local AI fallback, app still works.
- No Razorpay keys → demo payment mode, app still works.
- No Gmail credentials → demo email mode, app still works.

## Run
### Backend
cd backend
npm install
copy .env.example .env
edit .env
npm run seed
npm run dev

### Frontend
cd frontend
npm install
npm run dev

Demo:
Admin: admin@tuitionpro.com / TuitionProAdmin123
Student: student@tuitionpro.com / TuitionProStudent123

## Optional integrations
See backend/.env.example.

## Experiment 8: Postman REST API Testing
An expanded Postman collection is provided to demonstrate REST API testing.

**How to test the API using Postman:**
1. Import `postman/TuitionPro.postman_collection.json` into Postman.
2. Because the app uses highly secure **HttpOnly Cookies** instead of manual Bearer tokens, you must first execute the **Auth - Login POST** request.
3. Postman will automatically save the `tp_token` cookie.
4. You can now seamlessly execute all other authenticated endpoints (Students GET, Attendance POST, etc.) without manually managing tokens!

## Important lab principle
The advanced features do not replace the lab implementations. The project still contains explicit demonstrations for:
1 Bootstrap + client validation
2 ES6 JavaScript
3 React functional components / JSX / Props / State
4 React Router / Hooks
5 MongoDB CRUD
6 Node + Express + Mongoose
7 Node HTTP / FS / Buffer / Streams / Event Loop
8 REST API + Postman
9 React + Express + MongoDB + Axios
10 MERN cloud deployment

See WEB_LAB_COMPLIANCE.md.
