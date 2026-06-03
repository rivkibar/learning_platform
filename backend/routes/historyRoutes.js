const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/history/:userId
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const history = await prisma.prompt.findMany({
      where: { userId: parseInt(userId) },
      include: { 
        subCategory: true, 
        category: true 
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;