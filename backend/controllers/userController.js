const prisma = require('../services/prisma');

const createUser = async (req, res) => {
    try {
        const { name, phone } = req.body;

        // בדיקה שכל השדות הגיעו מה-Frontend
        if (!name || !phone) {
            return res.status(400).json({ error: "Name and phone are required" });
        }

        // שינוי ל-findFirst כדי למנוע את קריסת ה-where הייחודי של פריזמה
        let user = await prisma.User.findFirst({
            where: { phone: phone }
        });

        // אם המשתמש לא קיים בדאטה-בייס, ניצור אותו
        if (!user) {
            user = await prisma.User.create({
                data: { name, phone }
            });
        }

        // מחזירים תשובה חיובית ל-Frontend יחד עם אובייקט המשתמש
        res.status(200).json({ message: "User ready", user });
    } catch (error) {
        console.error("❌ Login Error Detail:", error);
        res.status(500).json({ error: "Something went wrong on the server" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.User.findMany();
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