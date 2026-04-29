import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Order = sequelize.define('Order', {
    totalAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'completed', 'cancelled'),
        defaultValue: 'pending'
    }
});

export default Order;