const prisma = require('../services/prisma');

const createUser = async (req, res) => {
    try {
        const { name, phone } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ error: "Name and phone are required" });
        }

  
        let user = await prisma.user.findUnique({
            where: { phone: phone }
        });

      
        if (!user) {
            user = await prisma.user.create({
                data: { name, phone }
            });
        }

        res.status(200).json({ message: "User ready", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong on the server" });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not fetch users" });
    }
};

module.exports = {
    createUser,
    getAllUsers
};