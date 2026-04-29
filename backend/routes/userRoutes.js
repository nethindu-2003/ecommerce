import express from 'express';
const router = express.Router();
import * as authController from '../controllers/authController.js';
import * as orderController from '../controllers/orderController.js';
import * as adminController from '../controllers/adminController.js';
import jwt from 'jsonwebtoken';

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

// Products & Categories (for shopping)
router.get('/products', adminController.getProducts);
router.get('/categories', adminController.getCategories);

export default router;
