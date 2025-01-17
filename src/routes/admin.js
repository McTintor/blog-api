const express = require("express");
const { promoteUser } = require("../controllers/adminController");
const { deletePost } = require("../controllers/postController");
const passport = require("passport");
const checkRole = require("../middlewares/role");

const router = express.Router();

router.post(
  "/admin/promote",
  passport.authenticate("jwt", { session: false }),
  checkRole("admin"),
  promoteUser
);

router.delete(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  checkRole("admin"),
  deletePost
);

module.exports = router;