// routes.js
const express = require('express');
const { adminLogin, adminAddItem, adminDeleteItem, adminUpdateItem, viewItems, userBookItems } = require('./controllers');
const { authenticateAdmin } = require('./middlewares');

const router = express.Router();

router.post('/admin/login', adminLogin);
router.post('/admin/addItem', authenticateAdmin, adminAddItem);
router.delete('/admin/removeItem/:id', authenticateAdmin, adminDeleteItem);
router.put('/admin/updateItem/:id', authenticateAdmin, adminUpdateItem);

router.get('/viewItems', viewItems);

router.post('/user/bookItems', userBookItems);

module.exports = router;
