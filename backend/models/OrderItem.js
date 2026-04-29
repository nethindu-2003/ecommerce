import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const OrderItem = sequelize.define('OrderItem', {
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
});

export default OrderItem;