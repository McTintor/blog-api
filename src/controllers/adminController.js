const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const promoteUser = async (req, res) => {
  const { username, newRole } = req.body;

  // Validate the new role
  if (!['reader', 'author', 'admin'].includes(newRole)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    // Find the user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's role
    const updatedUser = await prisma.user.update({
      where: { username },
      data: { role: newRole },
    });

    res.status(200).json({ message: `User promoted to ${newRole}`, user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error promoting user" });
  }
};

module.exports = {
  promoteUser,
};