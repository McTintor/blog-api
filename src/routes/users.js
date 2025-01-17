const express = require("express");
const { 
  registerUser, 
  loginUser, 
  getUserDetails
} = require("../controllers/userController");
const passport = require("passport");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  getUserDetails
);

module.exports = router;