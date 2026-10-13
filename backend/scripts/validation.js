import mongoose from 'mongoose';

// Define a strict schema with Validation Rules
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        minlength: [3, 'Username must be at least 3 characters long'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address (e.g., user@domain.com)'],
        unique: true
    },
    role: {
        type: String,
        enum: {
            values: ['Student', 'Admin', 'Tutor'],
            message: '{VALUE} is not a valid user role'
        },
        default: 'Student'
    },
    age: {
        type: Number,
        min: [10, 'Users must be at least 10 years old']
    }
});

// Compile Schema into a Model
const User = mongoose.model('User', userSchema);

async function testValidation() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/tuitionDB');
        console.log('Successfully connected to MongoDB for Validation Testing\n');

        // Test 1: Insert Valid Data
        console.log('--- TEST 1: Inserting Valid User ---');
        const validUser = new User({
            username: 'Shaurya',
            email: 'shaurya@tuitionpro.com',
            role: 'Admin',
            age: 20
        });
        const savedUser = await validUser.save();
        console.log(`Success! Valid user "${savedUser.username}" saved to database.\n`);

        // Test 2: Insert Invalid Data (Will trigger validation errors)
        console.log('--- TEST 2: Inserting Invalid User ---');
        const invalidUser = new User({
            username: 'Sh',               // Fails minlength (needs 3)
            email: 'invalid-email-format',// Fails regex match
            role: 'Guest',                // Fails enum (not in allowed list)
            age: 5                        // Fails min (needs to be >= 10)
        });

        // This save will fail and immediately jump to the catch block
        await invalidUser.save();

    } catch (error) {
        // Catch and format the Mongoose Validation Errors
        console.error('[DATABASE REJECTION] Validation Failed:');
        if (error.name === 'ValidationError') {
            for (let field in error.errors) {
                console.error(` ❌ ${field.toUpperCase()}: ${error.errors[field].message}`);
            }
        } else {
            console.error(error);
        }
    } finally {
        // Clean up test data and close connection
        await User.deleteMany({ email: 'shaurya@tuitionpro.com' });
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

testValidation();