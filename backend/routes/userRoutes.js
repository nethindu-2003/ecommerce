const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');
const jwt = require('jsonwebtoken');

// Authentication Middleware
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Login required' });
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Session expired' });
    }
};

router.use(authenticate);

// Profile
router.get('/profile', authController.getProfile);
router.patch('/profile', authController.updateProfile);

// Orders
router.get('/orders', orderController.getMyOrders);
router.post('/orders', orderController.createOrder);

module.exports = router;
