import express from 'express';
const router = express.Router();
import * as adminController from '../controllers/adminController.js';
import jwt from 'jsonwebtoken';

// Middleware to verify Admin role
const isAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Apply isAdmin to all routes
router.use(isAdmin);

// Dashboard
router.get('/stats', adminController.getStats);

// User Management
router.get('/users', adminController.getUsers);
router.patch('/users/:id/toggle', adminController.toggleUserStatus);
router.get('/users/:id/orders', adminController.getUserOrders);

// Product Management
router.get('/products', adminController.getProducts);
router.post('/products', adminController.createProduct);
router.patch('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);
router.get('/products/:id/orders', adminController.getProductOrders);

// Order Management
router.get('/orders', adminController.getOrders);
router.patch('/orders/:id/status', adminController.updateOrderStatus);

// Settings Management
router.get('/settings', adminController.getSettings);
router.patch('/settings/:id', adminController.updateSetting);

// Category Management
router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.createCategory);
router.delete('/categories/:id', adminController.deleteCategory);

export default router;
