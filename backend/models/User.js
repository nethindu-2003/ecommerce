import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import bcrypt from 'bcrypt';

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user',
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true 
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other', 'prefer_not_to_say'),
        allowNull: true
    },
    birthday: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

export default User;