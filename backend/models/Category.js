import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Category = sequelize.define('Category', {
    name: { type: DataTypes.STRING, allowNull: false }
});

export default Category;