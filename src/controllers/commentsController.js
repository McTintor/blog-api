const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a comment
const createComment = async (req, res) => {
    const { content } = req.body;
    const postId = parseInt(req.params.postId, 10); // Parse postId to an integer
    const userId = req.user.id; // Extracted from JWT
  
    try {
      // Ensure the post exists
      const post = await prisma.post.findUnique({ where: { id: postId } });
      if (!post) return res.status(404).json({ error: "Post not found" });
  
      // Create the comment
      const comment = await prisma.comment.create({
        data: {
          content,
          postId,
          userId,
        },
      });
  
      res.status(201).json({ message: "Comment created", comment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create comment" });
    }
  };
  
  
  // Get all comments for a post
  const getComments = async (req, res) => {
    const postId = parseInt(req.params.postId, 10);
  
    try {
      const comments = await prisma.comment.findMany({
        where: { postId: parseInt(postId) },
        include: { user: true }, // Include comment author info
      });
  
      res.status(200).json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  };

  // Edit Comment
  const editComment = async (req, res) => {
    const commentId = parseInt(req.params.commentId, 10);
    const { content } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role; // Assuming `role` is part of the `req.user` object
  
    try {
      const comment = await prisma.comment.findUnique({
        where: { id: Number(commentId) },
        include: { post: true }, // Include the post to check author
      });
      if (!comment) return res.status(404).json({ message: "Comment not found" });
  
      // Check if the user is the comment creator, the post author, or an admin
      if (comment.userId !== userId && comment.post.authorId !== userId && userRole !== "admin") {
        return res.status(403).json({ message: "You are not authorized to edit this comment" });
      }
  
      const updatedComment = await prisma.comment.update({
        where: { id: Number(commentId) },
        data: { content },
      });
  
      res.status(200).json({ message: "Comment updated", updatedComment });
    } catch (error) {
      res.status(500).json({ message: "Failed to update comment", error });
    }
  };
  
  
  // Delete a comment
  const deleteComment = async (req, res) => {
    const commentId = parseInt(req.params.commentId, 10); // Parse commentId to an integer
    const userId = req.user.id;
    const userRole = req.user.role; // Assuming `role` is part of the `req.user` object
  
    try {
      const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  
      if (!comment) return res.status(404).json({ error: "Comment not found" });
  
      // Ensure the user is the comment author, the post author, or an admin
      const post = await prisma.post.findUnique({ where: { id: comment.postId } });
  
      if (comment.userId !== userId && post.authorId !== userId && userRole !== "admin") {
        return res.status(403).json({ error: "Unauthorized to delete this comment" });
      }
  
      await prisma.comment.delete({ where: { id: commentId } });
      res.status(200).json({ message: "Comment deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete comment" });
    }
  };
    

  module.exports = {
    createComment,
    getComments,
    deleteComment,
    editComment
  };