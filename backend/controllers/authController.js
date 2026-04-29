import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/index.js';

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email 
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 2. Compare hashed passwords using bcrypt 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 3. Check if account is active 
        if (!user.isActive) {
            return res.status(403).json({ message: 'Your account has been deactivated. Please contact support.' });
        }

        // 4. Generate JWT for session handling 
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            role: user.role,
            message: "Login successful"
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const register = async (req, res) => {
    try {
        const { email, password, name, gender, birthday } = req.body;

        // 1. Basic Email Validation
        if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // 2. Strong Password Validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!password || !password.match(passwordRegex)) {
            return res.status(400).json({ 
                message: 'Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.' 
            });
        }

        // 3. Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // 4. Create user
        const user = await User.create({ 
            email, 
            password, 
            name, 
            gender, 
            birthday,
            role: 'user' 
        });

        res.status(201).json({
            message: 'User registered successfully',
            userId: user.id
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, gender, birthday, password } = req.body;
        const user = await User.findByPk(req.user.id);

        if (name) user.name = name;
        if (gender) user.gender = gender;
        if (birthday) user.birthday = birthday;

        if (password) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!password.match(passwordRegex)) {
                return res.status(400).json({ message: 'Password does not meet complexity requirements' });
            }
            user.password = password; // Hook will hash it
        }

        await user.save();
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile' });
    }
};

export { login, register, getProfile, updateProfile };