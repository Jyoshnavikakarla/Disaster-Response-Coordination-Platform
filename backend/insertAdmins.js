// insertAdmins.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Authority = require("./src/models/Authority"); // adjust path if needed

const admins = [
  { name: "Admin 1", email: "admin1@example.com", password: "admin123", role: "authority" },
  { name: "Admin 2", email: "admin2@example.com", password: "admin123", role: "authority" },
  { name: "Admin 3", email: "admin3@example.com", password: "admin123", role: "authority" },
  { name: "Admin 4", email: "admin4@example.com", password: "admin123", role: "authority" },
];

async function insertAdmins() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    for (let admin of admins) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      admin.password = hashedPassword;

      // Insert into authorities collection
      const existing = await Authority.findOne({ email: admin.email });
      if (!existing) {
        await Authority.create(admin);
        console.log(`Inserted: ${admin.email}`);
      } else {
        console.log(`Already exists: ${admin.email}`);
      }
    }

    console.log("All done!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

insertAdmins();
