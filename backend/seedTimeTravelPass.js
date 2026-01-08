/**
 * Seed script to add Time Travel Pass product to the store
 * Run with: node seedTimeTravelPass.js
 */
import mongoose from 'mongoose';
import { env } from './src/lib/env.js';
import StoreProduct from './src/models/StoreProduct.js';

const seedTimeTravelPass = async () => {
    try {
        await mongoose.connect(env.DB_URL);
        console.log('Connected to MongoDB');

        // Check if product already exists
        const existing = await StoreProduct.findOne({
            name: { $regex: /time travel/i }
        });

        if (existing) {
            console.log('Time Travel Pass product already exists:', existing.name);
            console.log('Product ID:', existing._id);
            process.exit(0);
        }

        // Create the product
        const timeTravelPass = await StoreProduct.create({
            name: 'Time Travel Pass',
            description: 'Restore a missed streak day. Travel back in time to complete a missing challenge. Valid until end of month.',
            price: 50,
            category: 'digital',
            stock: -1, // unlimited
            isFeatured: true,
            isActive: true,
            image: '🎫' // Can be replaced with an actual image URL
        });

        console.log('✅ Time Travel Pass product created successfully!');
        console.log('Product ID:', timeTravelPass._id);
        console.log('Product:', timeTravelPass);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding Time Travel Pass:', error);
        process.exit(1);
    }
};

seedTimeTravelPass();
