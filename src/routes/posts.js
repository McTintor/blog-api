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

// Public route to get all published posts with pagination
router.get("/", getAllPosts);

// Public route to get a single post by ID
router.get("/:postId", getPostById);

// Public route to get posts by author username with pagination
router.get("/author/:username", getPostsByAuthorUsername);

// Protected route to create a new post (Authors and Admins only)
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  checkRole("author", "admin"), // Allow authors and admins
  createPost
);

// Protected route to update a post (Authors and Admins only)
router.put(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  checkRole("author", "admin"), // Allow authors and admins
  updatePost
);

// Protected route to delete a post (Authors and Admins only)
router.delete(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  checkRole("author", "admin"), // Allow authors and admins
  deletePost
);

module.exports = router;
