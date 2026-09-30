# MongoDB Setup & Execution Guide

This document outlines how to execute the MongoDB shell script required for **Experiment 5** (MongoDB CRUD Operations) and how to configure the main application database.

## Experiment 5: Running the MongoDB Lab Script

The script `backend/scripts/collegedb.mongosh.js` demonstrates basic MongoDB operations: switching databases, creating a collection, inserting documents, querying, updating, and deleting.

### Method 1: Using `mongosh` CLI (Terminal)

1. Ensure you have MongoDB Shell (`mongosh`) installed.
2. Open your terminal at the root of the project.
3. Run the script directly against your local MongoDB instance or Atlas cluster:

```bash
# For local MongoDB
mongosh "mongodb://localhost:27017" backend/scripts/collegedb.mongosh.js

# For MongoDB Atlas
mongosh "mongodb+srv://<username>:<password>@<cluster>.mongodb.net" backend/scripts/collegedb.mongosh.js
```

### Method 2: Using MongoDB Compass

1. Open **MongoDB Compass** and connect to your database cluster.
2. Click on the **>_ MONGOSH** button at the bottom-left of the screen to open the integrated shell.
3. You can either copy the contents of `backend/scripts/collegedb.mongosh.js` and paste it directly into the terminal, OR load the file by typing the absolute path:
```javascript
load("C:/absolute/path/to/backend/scripts/collegedb.mongosh.js")
```

## TuitionPro App Integration (Mongoose)

While the experiment script uses raw MongoDB commands, the main TuitionPro backend uses **Mongoose** (an ODM) for schema validation, relations, and business logic.

To configure the main application, ensure your `backend/.env` file has the correct connection string:
```env
MONGO_URI=mongodb://127.0.0.1:27017/tuitionpro
```
The application will automatically connect and create collections when you start the server using `npm run dev`.
