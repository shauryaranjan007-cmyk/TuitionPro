# Deployment Guide

## MongoDB Atlas
Create a free cluster, database user and connection string. Configure network access appropriately.

## Backend on Render
Root: `backend`
Build: `npm install`
Start: `npm start`
Variables:
MONGO_URI
JWT_SECRET
CLIENT_URL
PORT=5000
Optional:
GEMINI_API_KEY
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
GMAIL_USER
GMAIL_APP_PASSWORD
GMAIL_CLIENT_ID
GMAIL_CLIENT_SECRET
GMAIL_REFRESH_TOKEN

## Frontend on Vercel
Root: `frontend`
Build: `npm run build`
Output: `dist`

### Vercel Configuration (`vercel.json`)
We include a `vercel.json` file in the frontend directory to solve two critical problems:
1. **SPA Routing**: Rewrites all missing files to `/index.html` so React Router handles URLs without throwing 404s.
2. **API Proxying**: Rewrites `/api/(.*)` to your Render backend. This avoids CORS issues entirely and avoids exposing the backend URL directly in the browser source. **Make sure to update `destination` in `vercel.json` to point to your actual Render backend URL.**

Variable:
VITE_API_URL=/api

## Final Post-Deploy Checklist
To ensure your deployment is perfectly configured, perform this manual test flow:
1. **Load Frontend:** Ensure the Vercel URL loads without errors (tests static hosting).
2. **Registration:** Create a test user via `/register` (tests backend DB write).
3. **Login:** Log in with the test user or `admin@tuitionpro.com` (tests DB read & HttpOnly cookie issuance).
4. **Dashboard:** Verify stats load without Axios network errors (tests CORS / Proxy).
5. **Students:** Add a new student, edit their batch, then delete them (tests full CRUD).
6. **Attendance & Payments:** Mark a student present and record a fee (tests relational linking).
7. **Refresh Browser:** Refresh the `/students` page (tests `vercel.json` SPA rewrite rule).
8. **Experiments:** Visit `/experiments` to ensure all lab implementations load successfully.

## Security pre-deployment checklist
- Set a random JWT_SECRET of at least 32 characters in the hosting provider.
- Set CLIENT_URL to the exact deployed frontend origin.
- Set NODE_ENV=production.
- Never upload backend/.env; use hosting-provider environment variables.
- Configure MongoDB Atlas Network Access for the backend's egress/IP strategy.
- Configure SEED_* variables only for local development; never run `npm run seed` in production.
- The API uses HttpOnly cookies for JWTs, Helmet, CORS allow-listing, body-size limits and rate limiting.
- Students can only read their own student/attendance/payment records; admin-only operations remain protected on the server.
- Gmail sending is admin-only.
- Razorpay demo mode is disabled in production when keys are absent.
