import { Category } from './models/index.js';
import { connectDB, sequelize } from './db.js';
import dotenv from 'dotenv';
dotenv.config();

const initialCategories = [
    { name: 'Electronics' },
    { name: 'Fashion' },
    { name: 'Home & Kitchen' },
    { name: 'Beauty & Health' },
    { name: 'Sports & Outdoors' },
    { name: 'Books & Stationery' },
    { name: 'Groceries' },
    { name: 'Toys & Games' }
];

const seedCategories = async () => {
    try {
        await connectDB();
        
        console.log('Seeding categories...');
        
        for (const cat of initialCategories) {
            const [category, created] = await Category.findOrCreate({
                where: { name: cat.name },
                defaults: cat
            });
            
            if (created) {
                console.log(`Created category: ${cat.name}`);
            } else {
                console.log(`Category already exists: ${cat.name}`);
            }
        }
        
        console.log('Category seeding completed!');
        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
};

seedCategories();
