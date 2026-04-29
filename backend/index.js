import express from 'express';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import adminOptions from './config/adminConfig.js';
import { connectDB } from './db.js';
import db from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bcrypt from 'bcrypt';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

const start = async () => {
    try {
        // Connect to Database
        await connectDB();

        const admin = new AdminJS(adminOptions);

        // Build the authenticated router
        const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
            admin,
            {
                authenticate: async (email, password) => {
                    const user = await db.User.findOne({ where: { email } });
                    if (user) {
                        const matched = await bcrypt.compare(password, user.password);
                        // Allow any authenticated user to enter (UI will be restricted based on role)
                        if (matched) return user;
                    }
                    return false;
                },
                cookiePassword: process.env.SESSION_SECRET || 'a-very-long-and-secure-cookie-password',
            },
            null,
            {
                resave: false,
                saveUninitialized: true,
                secret: process.env.SESSION_SECRET || 'session-secret',
                cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 7 days
            }
        );

        // Mount AdminJS Routes
        app.use(admin.options.rootPath, adminRouter);

        // Mount API Routes
        app.use('/api', authRoutes);
        app.use('/api/admin', adminRoutes);
        app.use('/api/user', userRoutes);

        // Sync Database and Start Server
        await db.sequelize.sync();
        console.log('Database synced');

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`AdminJS (Secure) is at http://localhost:${PORT}${admin.options.rootPath}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

start();