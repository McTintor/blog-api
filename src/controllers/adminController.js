const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const promoteUser = async (req, res) => {
    const { userId, newRole } = req.body;
  
    // Validate the new role
    if (!['author', 'admin'].includes(newRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }
  
    try {
      // Find the user by ID
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update the user's role
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
      });
  
      res.status(200).json({ message: `User promoted to ${newRole}`, user: updatedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error promoting user" });
    }
  };

  module.exports = {
    promoteUser
  };