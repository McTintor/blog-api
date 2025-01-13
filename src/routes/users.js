const express = require("express");
const { 
  registerUser, 
  loginUser, 
  getUserDetails
} = require("../controllers/userController");
const passport = require("passport");

const router = express.Router();

// Public route to register a new user
router.post("/register", registerUser);

// Public route to log in and get a JWT
router.post("/login", loginUser);

// Protected route to get the logged-in user's details
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  getUserDetails
);

// router.post("/admin/promote", checkRole('admin'), promoteUser);

module.exports = router;