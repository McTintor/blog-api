const express = require("express");
const passport = require("passport");
const {
  createComment,
  getComments,
  deleteComment,
  editComment
} = require("../controllers/commentsController");

const router = express.Router();

// Create a comment
router.post(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  createComment
);

// Get all comments for a post
router.get("/:postId", getComments);

// Edit Comment
router.put("/:commentId", passport.authenticate("jwt", { session: false }), editComment);

// Delete a comment
router.delete(
  "/:commentId",
  passport.authenticate("jwt", { session: false }),
  deleteComment
);

module.exports = router;
