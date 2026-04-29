import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Setting = sequelize.define('Setting', {
    key: { type: DataTypes.STRING, allowNull: false, unique: true },
    value: { type: DataTypes.STRING, allowNull: false }
});

export default Setting;