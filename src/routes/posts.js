const express = require("express");
const { 
  createPost, 
  getAllPosts, 
  getPostById, 
  updatePost, 
  deletePost, 
  getPostsByAuthorUsername 
} = require("../controllers/postController");
const passport = require("passport");
const checkRole = require("../middlewares/role");

const router = express.Router();

router.get("/", getAllPosts);

router.get("/:postId", getPostById);

router.get("/author/:username", getPostsByAuthorUsername);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  checkRole("author", "admin"),
  createPost
);

router.put(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  checkRole("author", "admin"),
  updatePost
);

router.delete(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  checkRole("author", "admin"),
  deletePost
);

module.exports = router;
