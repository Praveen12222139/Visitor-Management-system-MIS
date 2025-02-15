// import bcrypt from "bcryptjs";
// import express from "express";
// import Employee from "../models/Employee.js";

// const router = express.Router();

// router.post("/register", async (req, res) => {
//   try {
//     const { fullname, email, password, department } = req.body;
//     if (!fullname || !email || !password || !department) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
//     console.log("Email:", email);
//     console.log("Password:", password);
//     console.log("Fullname:", fullname);
//     console.log("Department:", department);

//     const user = await Employee.findOne({ email });
//     if (user) {
//       return res.status(400).json({ message: "Employee already registered" });
//     }
//     if (password.length < 6) {
//       return res
//         .status(400)
//         .json({ message: "Password must be atleast 6 characters long" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newEmp = new Employee({
//       fullName: fullname,
//       email: email,
//       password: hashedPassword,
//       department: department,
//     });
//     await newEmp.save();
//     return res
//       .status(200)
//       .json({ message: "Employee registered successfully" });
//   } catch (err) {
//     console.error("Error in register:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
//     const user = await Employee.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Employee not registered" });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }
//     return res.status(200).json({ message: "Employee logged in successfully" });
//   } catch (err) {
//     console.error("Error in login:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// export default router;


import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";
import Employee from "../models/Employee.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Ensure to set this in your .env file

// Middleware to verify JWT
export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, department } = req.body;
    console.log("Email:", email);
    if (!fullName || !email || !password || !department) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await Employee.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Employee already registered" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newEmployee = new Employee({
      fullName: fullName,
      email,
      password: hashedPassword,
      department,
    });
    await newEmployee.save();

    const token = jwt.sign({ id: newEmployee._id, email }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({ message: "Employee registered successfully", token });
  } catch (err) {
    console.error("Error in register:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await Employee.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Employee not registered" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, email }, JWT_SECRET, { expiresIn: "7d" });
    return res.status(200).json({ message: "Employee logged in successfully", token });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
