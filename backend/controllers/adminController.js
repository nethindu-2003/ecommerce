import { User, Order, Product, Category, OrderItem, Setting } from '../models/index.js';
import { sequelize } from '../db.js';

// DASHBOARD STATS
const getStats = async (req, res) => {
    try {
        const totalUsers = await User.count({ where: { role: 'user' } });
        const totalProducts = await Product.count();
        const totalOrders = await Order.count();
        const revenueResult = await Order.findAll({
            where: { status: ['accepted', 'completed'] },
            attributes: [[sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalRevenue']]
        });
        const totalRevenue = revenueResult[0].dataValues.totalRevenue || 0;
        res.json({ totalUsers, totalProducts, totalOrders, totalRevenue: parseFloat(totalRevenue).toFixed(2) });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};

// USER MANAGEMENT
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({ 
            where: { role: 'user' },
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.isActive = !user.isActive;
        await user.save();
        res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
    } catch (error) {
        res.status(500).json({ message: 'Error toggling user status' });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { 
                userId: req.params.id
            },
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user orders' });
    }
};

// PRODUCT MANAGEMENT (CRUD)
const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({ include: [Category] });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
};

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Error creating product', error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        await product.update(req.body);
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: 'Error updating product' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        await product.destroy();
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
};

const getProductOrders = async (req, res) => {
    try {
        const orderItems = await OrderItem.findAll({
            where: { productId: req.params.id },
            include: [{ 
                model: Order, 
                include: [{ model: User, attributes: ['email', 'name'] }] 
            }],
            order: [[Order, 'createdAt', 'DESC']]
        });
        res.json(orderItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product orders' });
    }
};

// ORDER MANAGEMENT
const getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: User, attributes: ['email', 'name', 'gender', 'role'] },
                { model: OrderItem, include: [Product] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByPk(req.params.id, {
            include: [{ model: OrderItem }]
        });
        
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // If status is changing to 'accepted', reduce stock
        if (status === 'accepted' && order.status !== 'accepted') {
            for (const item of order.OrderItems) {
                const product = await Product.findByPk(item.productId);
                if (product) {
                    if (product.stock < item.quantity) {
                        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
                    }
                    product.stock -= item.quantity;
                    await product.save();
                }
            }
        }

        // If status is changing FROM 'accepted' to 'cancelled', restore stock
        if (status === 'cancelled' && order.status === 'accepted') {
            for (const item of order.OrderItems) {
                const product = await Product.findByPk(item.productId);
                if (product) {
                    product.stock += item.quantity;
                    await product.save();
                }
            }
        }

        order.status = status;
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
};

// SETTINGS MANAGEMENT
const getSettings = async (req, res) => {
    try {
        const settings = await Setting.findAll();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching settings' });
    }
};

const updateSetting = async (req, res) => {
    try {
        const { value } = req.body;
        const setting = await Setting.findByPk(req.params.id);
        if (!setting) return res.status(404).json({ message: 'Setting not found' });
        setting.value = value;
        await setting.save();
        res.json(setting);
    } catch (error) {
        res.status(500).json({ message: 'Error updating setting' });
    }
};

// CATEGORY MANAGEMENT
const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories' });
    }
};

const createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: 'Error creating category' });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        await category.destroy();
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category' });
    }
};

export {
    getStats,
    getUsers,
    toggleUserStatus,
    getUserOrders,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductOrders,
    getOrders,
    updateOrderStatus,
    getSettings,
    updateSetting,
    getCategories,
    createCategory,
    deleteCategory
};
