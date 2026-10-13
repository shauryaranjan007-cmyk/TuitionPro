import mongoose from 'mongoose';

// Define the Schema matching the TuitionPro Subjects module
const subjectSchema = new mongoose.Schema({
    name: String,
    code: String,
    department: String,
    isActive: Boolean
});

// Compile Schema into a Model
const Subject = mongoose.model('Subject', subjectSchema);

async function runDatabaseOperations() {
    try {
        // Connect to local MongoDB instance
        await mongoose.connect('mongodb://127.0.0.1:27017/tuitionDB');
        console.log('Successfully connected to MongoDB - tuitionDB');

        // 1. CREATE
        const newSubject = await Subject.create({
            name: 'Information Technology',
            code: 'IT-101',
            department: 'Engineering',
            isActive: true
        });
        console.log('\n[CREATE] Inserted Document:', newSubject);

        // 2. READ
        const allSubjects = await Subject.find();
        console.log('\n[READ] All Subjects in Collection:', allSubjects);

        // 3. UPDATE
        await Subject.updateOne(
            { code: 'IT-101' },
            { $set: { department: 'Computer Sciences & IT' } }
        );
        console.log('\n[UPDATE] Successfully updated department for IT-101');

        // 4. DELETE
        await Subject.deleteOne({ code: 'IT-101' });
        console.log('\n[DELETE] Successfully deleted subject IT-101');

        // Final verification read
        const remainingSubjects = await Subject.find();
        console.log('\n[VERIFY] Remaining Subjects:', remainingSubjects);

    } catch (error) {
        console.error('Database Operation Error:', error);
    } finally {
        // Close the connection
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

runDatabaseOperations();