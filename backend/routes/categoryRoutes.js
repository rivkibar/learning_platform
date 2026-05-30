const express = require('express');
const router = express.Router();
const { getCategories, createCategory, createSubCategory } = require('../controllers/categoryController');


router.get('/', getCategories);


router.post('/', createCategory);


router.post('/sub', createSubCategory);

module.exports = router;