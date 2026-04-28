const { Order, OrderItem, Product } = require('../models');

const createOrder = async (req, res) => {
    try {
        const { items } = req.body; // Array of { productId, quantity }
        let totalAmount = 0;

        // Calculate total and verify products
        for (const item of items) {
            const product = await Product.findByPk(item.productId);
            if (!product || product.stock < item.quantity) {
                return res.status(400).json({ message: `Product ${item.productId} unavailable or out of stock` });
            }
            totalAmount += parseFloat(product.price) * item.quantity;
        }

        const order = await Order.create({
            userId: req.user.id,
            totalAmount,
            status: 'pending'
        });

        // Create order items and update stock
        for (const item of items) {
            const product = await Product.findByPk(item.productId);
            await OrderItem.create({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: product.price
            });
            product.stock -= item.quantity;
            await product.save();
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            include: [{ model: OrderItem, include: [Product] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

module.exports = { createOrder, getMyOrders };
