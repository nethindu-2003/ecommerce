import { Product, Category } from './models/index.js';
import { connectDB, sequelize } from './db.js';
import dotenv from 'dotenv';
dotenv.config();

const seedProducts = async () => {
    try {
        await connectDB();
        
        console.log('Fetching categories...');
        const categories = await Category.findAll();
        
        const productsToSeed = [];

        const data = {
            'Electronics': [
                { name: 'Smartphone', price: 85000, desc: 'High performance mobile device' },
                { name: 'Laptop', price: 150000, desc: 'Powerful work machine' },
                { name: 'Tablet', price: 45000, desc: 'Portable entertainment screen' },
                { name: 'Smartwatch', price: 12000, desc: 'Fitness and health tracker' },
                { name: 'Bluetooth Speaker', price: 8000, desc: 'Crystal clear audio' }
            ],
            'Fashion': [
                { name: 'T-Shirt', price: 1500, desc: 'Comfortable cotton wear' },
                { name: 'Jeans', price: 3500, desc: 'Durable denim' },
                { name: 'Jacket', price: 5500, desc: 'Warm and stylish' },
                { name: 'Shoes', price: 7500, desc: 'All-day comfort' },
                { name: 'Hat', price: 1200, desc: 'Classic accessory' }
            ],
            'Home & Kitchen': [
                { name: 'Blender', price: 12000, desc: 'Smoothies in seconds' },
                { name: 'Toaster', price: 4500, desc: 'Perfect breakfast toast' },
                { name: 'Coffee Maker', price: 18000, desc: 'Morning brew master' },
                { name: 'Microwave', price: 25000, desc: 'Quick and easy heating' },
                { name: 'Pan Set', price: 9500, desc: 'Non-stick cooking' }
            ],
            'Beauty & Health': [
                { name: 'Face Wash', price: 850, desc: 'Deep cleaning formula' },
                { name: 'Shampoo', price: 1100, desc: 'Shiny and healthy hair' },
                { name: 'Sunscreen', price: 1500, desc: 'UV protection' },
                { name: 'Perfume', price: 4500, desc: 'Long-lasting scent' },
                { name: 'Vitamin C Serum', price: 2200, desc: 'Glowing skin' }
            ],
            'Sports & Outdoors': [
                { name: 'Yoga Mat', price: 2500, desc: 'Anti-slip grip' },
                { name: 'Dumbbell Set', price: 15000, desc: 'Home workout essential' },
                { name: 'Running Shoes', price: 9500, desc: 'Lightweight and fast' },
                { name: 'Backpack', price: 4500, desc: 'Rugged outdoor bag' },
                { name: 'Water Bottle', price: 1500, desc: 'Eco-friendly hydration' }
            ],
            'Books & Stationery': [
                { name: 'Notebook', price: 450, desc: 'Hardcover journal' },
                { name: 'Pen Set', price: 1200, desc: 'Premium writing tools' },
                { name: 'Novel', price: 1800, desc: 'Bestselling fiction' },
                { name: 'Desk Organizer', price: 2500, desc: 'Neat workspace' },
                { name: 'Marker Pack', price: 950, desc: 'Vibrant colors' }
            ],
            'Groceries': [
                { name: 'Organic Tea', price: 850, desc: 'Soothing herbal blend' },
                { name: 'Olive Oil', price: 2500, desc: 'Extra virgin' },
                { name: 'Dark Chocolate', price: 1200, desc: '70% Cocoa' },
                { name: 'Honey', price: 1500, desc: 'Pure and natural' },
                { name: 'Pasta', price: 650, desc: 'Italian style' }
            ],
            'Toys & Games': [
                { name: 'Board Game', price: 3500, desc: 'Family fun night' },
                { name: 'Action Figure', price: 2500, desc: 'Collectable hero' },
                { name: 'Puzzle', price: 1500, desc: '1000 pieces' },
                { name: 'RC Car', price: 8500, desc: 'High speed racing' },
                { name: 'Building Blocks', price: 4500, desc: 'Creative construction' }
            ]
        };

        console.log('Generating 100+ product records...');
        
        categories.forEach(cat => {
            const templates = data[cat.name] || [
                { name: 'Generic Item', price: 1000, desc: 'High quality product' }
            ];
            
            // For each category, create ~15 variations
            for (let i = 1; i <= 15; i++) {
                const template = templates[Math.floor(Math.random() * templates.length)];
                productsToSeed.push({
                    name: `${template.name} ${i}`,
                    price: template.price + (Math.floor(Math.random() * 500) * 10),
                    stock: Math.floor(Math.random() * 100) + 10,
                    description: `${template.desc}. This is premium version ${i} of our popular line.`,
                    categoryId: cat.id
                });
            }
        });

        console.log(`Seeding ${productsToSeed.length} products...`);
        
        for (const p of productsToSeed) {
            await Product.findOrCreate({
                where: { name: p.name },
                defaults: p
            });
        }
        
        console.log('Bulk product seeding completed!');
        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
