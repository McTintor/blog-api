const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new post
const createPost = async (req, res) => {
  try {
    console.log("Request body received:", req.body);
    const { title, content, published } = req.body;
    const { id: authorId } = req.user; // Assumes req.user is populated by Passport
    const newPost = await prisma.post.create({
      data: { title, content, published, authorId },
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({ 
      where: { published: true },
      include: {
        author: {
          select: {
            username: true,
            id: true
          },
        },
        comments: {
          include: {
            user: {
              select: {
                username: true, // Include the username of the commenter
              },
            },
          },
        },
      },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// Get a single post by ID
const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await prisma.post.findUnique({ 
      where: { id: parseInt(postId) },
      include: {
        author: { select: { username: true, id: true } },
        comments: { include: { user: { select: { username: true } } } },
      },
     });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

// Update a post
const updatePost = async (req, res) => {
  try {
    const { postId } = req.params; // Match the route parameter name
    const { title, content, published } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: parseInt(postId) },
      data: { title, content, published },
    });

    res.json(updatedPost);
  } catch (error) {
    console.error("Failed to update post:", error.message);
    res.status(500).json({ error: "Failed to update post" });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id; // Current user ID
    const userRole = req.user.role; // Current user role

    // Fetch the post to verify ownership
    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user is either an admin or the author of the post
    if (userRole !== "admin" && post.authorId !== userId) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }

    // Proceed to delete the post
    await prisma.post.delete({ where: { id: parseInt(postId) } });
    res.json({ message: "Post deleted" });
  } catch (error) {
    console.error("Failed to delete post:", error.message);
    res.status(500).json({ error: "Failed to delete post" });
  }
};


module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
};
