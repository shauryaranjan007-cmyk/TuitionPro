# TuitionPro Security Hardening

## Before deployment
1. Set `NODE_ENV=production`.
2. Generate a random `JWT_SECRET` of at least 32 characters.
3. Set `CLIENT_URL` to the exact Vercel/Netlify frontend origin.
4. Put all secrets in Render/Vercel environment variables. Never commit `.env`.
5. The backend now uses HttpOnly JWT cookies, CORS allow-listing, Helmet, rate limiting and a JSON body-size limit.
6. Student API reads are scoped to the logged-in student's linked `Student.user` record.
7. Attendance marking, student CRUD, payment recording and Gmail sending are admin-only.
8. Razorpay demo mode is allowed only in development. Production requires Razorpay credentials.
9. Do not run `npm run seed` in production; it deletes application data.
10. For an existing seeded database, run `npm run link-student` once after setting the two `LINK_STUDENT_*` variables.

## Local upgrade
The current project previously used a JWT in localStorage. The hardened version uses an HttpOnly cookie, so remove any old `tp_token` from the browser's localStorage if one exists. The non-sensitive `tp_user` entry is only used for frontend display/role navigation; the backend remains the authorization boundary.
