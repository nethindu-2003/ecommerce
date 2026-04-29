import { sequelize } from '../db.js';
import User from './User.js';
import Category from './Category.js';
import Product from './Product.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Setting from './Setting.js';

// Relationships 
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

const db = {
    sequelize,
    User,
    Category,
    Product,
    Order,
    OrderItem,
    Setting
};

export default db;
export { User, Category, Product, Order, OrderItem, Setting };