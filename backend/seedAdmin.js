import { User } from './models/index.js';
import { connectDB, sequelize } from './db.js';
import dotenv from 'dotenv';
dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();
        
        // Check if admin already exists
        const adminEmail = 'admin@example.com';
        const existingAdmin = await User.findOne({ where: { email: adminEmail } });

        if (existingAdmin) {
            console.log('Admin user already exists!');
        } else {
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: 'Admin@1234', // This will be hashed by the User model hooks
                role: 'admin',
                isActive: true
            });
            console.log('Admin user created successfully!');
            console.log('Email: admin@example.com');
            console.log('Password: Admin@1234');
        }
        
        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
