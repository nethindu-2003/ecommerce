import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Product = sequelize.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    description: { type: DataTypes.TEXT },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 }
});

export default Product;