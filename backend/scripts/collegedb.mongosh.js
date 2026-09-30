// collegedb.mongosh.js
// Experiment 5: MongoDB script demonstrating database creation, collections, CRUD operations.
// Run using: mongosh <connection-string> backend/scripts/collegedb.mongosh.js

print("==== Starting Experiment 5: MongoDB CRUD ====");

// 1. Create/Switch to DB
print("Switching to database 'collegedb'...");
const dbName = 'collegedb';
db = db.getSiblingDB(dbName);

// 2. Drop existing collection for clean state
print("Dropping 'students' collection if it exists...");
db.students.drop();

// 3. Create Collection
print("Creating 'students' collection...");
db.createCollection("students");

// 4. Insert 5 records
print("Inserting 5 student records...");
db.students.insertMany([
  { name: "Harsh Ranjan", branch: "IT", year: "TE", roll: 21, cgpa: 9.1 },
  { name: "Jane Doe", branch: "CS", year: "TE", roll: 15, cgpa: 8.5 },
  { name: "John Smith", branch: "ENTC", year: "BE", roll: 30, cgpa: 7.9 },
  { name: "Alice Johnson", branch: "IT", year: "SE", roll: 5, cgpa: 9.5 },
  { name: "Bob Brown", branch: "CS", year: "FE", roll: 44, cgpa: 8.1 }
]);

// 5. Find all records
print("Finding all students:");
let allStudents = db.students.find().toArray();
printjson(allStudents);

// 6. Update one record
print("Updating Jane Doe's CGPA to 8.8...");
db.students.updateOne(
  { name: "Jane Doe" }, 
  { $set: { cgpa: 8.8 } }
);

print("Verifying Jane Doe's update:");
printjson(db.students.find({ name: "Jane Doe" }).toArray());

// 7. Delete one record
print("Deleting John Smith...");
db.students.deleteOne({ name: "John Smith" });

// 8. Final check
print("Final count of students:");
print(db.students.countDocuments());

print("==== Experiment 5 Completed ====");
