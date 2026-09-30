import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

const newPassword = "password123";

try {
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  const user = await User.findOneAndUpdate(
    { email: "student@tuitionpro.com" },
    { password: hashedPassword },
    { new: true }
  );

  if (!user) {
    console.log("Student user not found.");
  } else {
    console.log("Student password reset successfully.");
    console.log("Email: student@tuitionpro.com");
    console.log("Password: password123");
  }

  await mongoose.disconnect();
} catch (error) {
  console.error("Reset failed:", error.message);
  process.exit(1);
}
