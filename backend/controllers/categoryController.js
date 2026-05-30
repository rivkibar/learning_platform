const prisma = require('../services/prisma');

const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                sub_categories: true 
            }
        });
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not fetch categories" });
    }
};


const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Category name is required" });
        }

        const newCategory = await prisma.category.create({
            data: { name }
        });
        res.status(201).json(newCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not create category" });
    }
};


const createSubCategory = async (req, res) => {
    try {
        const { name, category_id } = req.body;
        if (!name || !category_id) {
            return res.status(400).json({ error: "Name and category_id are required" });
        }

        const newSubCategory = await prisma.subCategory.create({
            data: { 
                name, 
                category_id: parseInt(category_id) 
            }
        });
        res.status(201).json(newSubCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not create sub-category" });
    }
};

module.exports = {
    getCategories,
    createCategory,
    createSubCategory
};