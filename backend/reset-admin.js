import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

const newPassword = "TuitionProAdmin@2026";

try {
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  const user = await User.findOneAndUpdate(
    { email: "admin@tuitionpro.com" },
    { password: hashedPassword, role: "admin" },
    { new: true }
  );

  if (!user) {
    console.log("Admin user not found.");
  } else {
    console.log("Admin password reset successfully.");
    console.log("Email: admin@tuitionpro.com");
    console.log("Password: TuitionProAdmin@2026");
  }

  await mongoose.disconnect();
} catch (error) {
  console.error("Reset failed:", error.message);
  process.exit(1);
}