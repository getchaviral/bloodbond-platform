require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function seedUsers() {
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteMany();

  await User.create([
    {
      name: "Admin",
      email: "admin@demo.com",
      password: "admin123",
      role: "admin",
    },
    {
      name: "Blood Bank",
      email: "bank@demo.com",
      password: "bank123",
      role: "bloodbank",
    },
    {
      name: "User",
      email: "user@demo.com",
      password: "user123",
      role: "user",
    },
  ]);

  console.log("Demo users created successfully");
  process.exit();
}

seedUsers();
