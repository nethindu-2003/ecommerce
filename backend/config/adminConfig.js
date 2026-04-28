const AdminJS = require('adminjs');
const AdminJSSequelize = require('@adminjs/sequelize');
const { User, Product, Category, Order, OrderItem, Setting } = require('../models');
const { componentLoader, Components } = require('./componentLoader');

AdminJS.registerAdapter(AdminJSSequelize);

const adminOptions = {
    resources: [
        {
            resource: User,
            options: {
                navigation: { name: 'User Management', icon: 'User' },
                properties: {
                    email: { isTitle: true },
                    password: { isVisible: false }, // Hide password field 
                },
                isVisible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
                isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
                actions: {
                    edit: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
                    delete: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
                    new: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
                },
            },
        },
        {
            resource: Product,
            options: {
                navigation: { name: 'E-commerce', icon: 'Package' },
                properties: {
                    name: { isTitle: true },
                },
                actions: {
                    edit: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
                    delete: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
                    new: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
                },
            },
        },
        {
            resource: Category,
            options: {
                navigation: { name: 'E-commerce', icon: 'List' },
                properties: {
                    name: { isTitle: true },
                },
                actions: {
                    edit: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
                    delete: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
                    new: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
                },
            },
        },
        {
            resource: Order,
            options: {
                navigation: { name: 'Sales', icon: 'ShoppingCart' },
                // Filter orders so regular users only see their own
                requestHandler: (request, context) => {
                    const { currentAdmin } = context;
                    if (currentAdmin && currentAdmin.role !== 'admin') {
                        request.query = { ...request.query, 'filters.userId': currentAdmin.id };
                    }
                    return request;
                },
                actions: {
                    edit: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
                    delete: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
                    new: { isAccessible: ({ currentAdmin }) => false }, // Orders usually created via frontend
                },
            },
        },
        {
            resource: OrderItem,
            options: {
                navigation: { name: 'Sales', icon: 'Hash' },
                actions: {
                    edit: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
                    delete: { isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin' },
                    new: { isAccessible: ({ currentAdmin }) => false },
                },
            },
        },
        {
            resource: Setting,
            options: {
                navigation: { name: 'Settings', icon: 'Settings' },
                isVisible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
                isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
                properties: {
                    key: { isTitle: true },
                    value: { type: 'textarea' }, // Makes it easier to edit config data
                },
            },
        },
    ],
    rootPath: '/admin',
    branding: {
        companyName: 'E-commerce Admin',
    },
    componentLoader,
    dashboard: {
        component: Components.Dashboard,
        handler: async (request, response, context) => {
            // Calculate System Summaries [cite: 35, 43]
            const totalUsers = await User.count();
            const totalOrders = await Order.count();
            const totalProducts = await Product.count();

            // Calculate Revenue [cite: 35]
            const orders = await Order.findAll();
            const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount || 0), 0);

            return {
                summary: {
                    totalUsers,
                    totalOrders,
                    totalProducts,
                    totalRevenue: totalRevenue.toFixed(2),
                },
            };
        },
    },
};

module.exports = adminOptions;