const express = require("express");
const passport = require("passport");
const {
  createComment,
  getComments,
  deleteComment,
  editComment
} = require("../controllers/commentsController");

const router = express.Router();

router.post(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  createComment
);

router.get("/:postId", getComments);

router.put("/:commentId", passport.authenticate("jwt", { session: false }), editComment);

router.delete(
  "/:commentId",
  passport.authenticate("jwt", { session: false }),
  deleteComment
);

module.exports = router;
