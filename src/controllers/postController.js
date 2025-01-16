const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new post
const createPost = async (req, res) => {
  try {
    if (!["author", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }

    const { title, content } = req.body;
    const { id: authorId } = req.user;
    const newPost = await prisma.post.create({
      data: { title, content, authorId },
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

// Get all posts with pagination
const getAllPosts = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const skip = (page - 1) * pageSize;
  const take = parseInt(pageSize);

  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      skip,
      take,
      include: {
        author: {
          select: {
            username: true,
            id: true,
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

    // Get total count of posts to calculate total pages
    const totalPosts = await prisma.post.count({
      where: { published: true },
    });

    const totalPages = Math.ceil(totalPosts / pageSize);

    res.json({
      posts,
      page,
      totalPages,
      totalPosts,
    });
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

// Get posts by author username with pagination
const getPostsByAuthorUsername = async (req, res) => {
  const { username } = req.params;
  const { page = 1, pageSize = 10 } = req.query;
  const skip = (page - 1) * pageSize;
  const take = parseInt(pageSize);

  try {
    // Fetch the user by username
    const author = await prisma.user.findUnique({
      where: { username },
    });

    if (!author) {
      return res.status(404).json({ message: "Author not found." });
    }

    // Fetch posts by the author
    const posts = await prisma.post.findMany({
      where: { authorId: author.id },
      skip,
      take,
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Optional: Order posts by creation date
      },
    });

    // Get total count of posts for this author
    const totalPosts = await prisma.post.count({
      where: { authorId: author.id },
    });

    const totalPages = Math.ceil(totalPosts / pageSize);

    if (!posts.length) {
      return res.status(404).json({ message: "No posts found for this author." });
    }

    return res.status(200).json({
      posts,
      page,
      totalPages,
      totalPosts,
    });
  } catch (err) {
    console.error("Error fetching posts by author username:", err);
    return res.status(500).json({ message: "An error occurred while fetching posts." });
  }
};

// Search posts with pagination
const searchPosts = async (req, res) => {
  const { query, page = 1, pageSize = 10 } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  const skip = (page - 1) * pageSize; // Calculate the offset for pagination

  try {
    // Fetch the matching posts
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive", // Case-insensitive search
            },
          },
          {
            author: {
              username: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
      skip, // Apply the skip (offset)
      take: parseInt(pageSize, 10), // Limit the number of posts returned
    });

    // Get total count of posts matching the search query
    const totalPosts = await prisma.post.count({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            author: {
              username: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      },
    });

    const totalPages = Math.ceil(totalPosts / pageSize); // Calculate total pages

    res.status(200).json({
      posts, // Paginated posts
      page: parseInt(page, 10), // Current page
      totalPages, // Total pages
      totalPosts, // Total number of posts
    });
  } catch (err) {
    console.error("Error searching posts:", err);
    res.status(500).json({ message: "An error occurred while searching posts." });
  }
};


module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsByAuthorUsername,
  searchPosts
};
