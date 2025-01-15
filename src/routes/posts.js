const express = require("express");
const { 
  createPost, 
  getAllPosts, 
  getPostById, 
  updatePost, 
  deletePost, 
  getPostsByAuthorUsername, 
} = require("../controllers/postController");
const passport = require("passport");

const router = express.Router();

// Public route to get all published posts
router.get("/", getAllPosts);

// Public route to get a single post by ID
router.get("/:postId", getPostById);

// Public route to get posts by author username
router.get("/author/:username", getPostsByAuthorUsername);

// Protected route to create a new post
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createPost
);

// Protected route to update a post
router.put(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  updatePost
);

// Protected route to delete a post
router.delete(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  deletePost
);

module.exports = router;
