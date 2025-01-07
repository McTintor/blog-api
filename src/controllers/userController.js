const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });
    res.status(201).json({ message: "User registered", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
};

// Login a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ id: user.id , message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Failed to login user" });
  }
};

// Get user details
const getUserDetails = async (req, res) => {
  try {
    const { id } = req.user; // Assumes req.user is populated by Passport
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserDetails,
};
