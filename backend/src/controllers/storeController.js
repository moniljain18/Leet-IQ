import StoreProduct from "../models/StoreProduct.js";
import StoreOrder from "../models/StoreOrder.js";
import User from "../models/User.js";

/**
 * Get all active store products
 */
export const getProducts = async (req, res) => {
    try {
        const { category } = req.query;

        const filter = { isActive: true };
        if (category && category !== "all") {
            filter.category = category;
        }

        const products = await StoreProduct.find(filter)
            .sort({ isFeatured: -1, createdAt: -1 });

        res.json(products);
    } catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
};

/**
 * Get single product details
 */
export const getProductById = async (req, res) => {
    try {
        const product = await StoreProduct.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        console.error("Get product error:", error);
        res.status(500).json({ message: "Failed to fetch product" });
    }
};

/**
 * Redeem coins for a product
 */
export const redeemProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { shippingAddress } = req.body;
        const userId = req.user._id;

        // Get product
        const product = await StoreProduct.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (!product.isActive) {
            return res.status(400).json({ message: "Product is no longer available" });
        }

        // Check stock
        if (product.stock !== -1 && product.stock <= 0) {
            return res.status(400).json({ message: "Product is out of stock" });
        }

        // Get user and check coins
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.coins < product.price) {
            return res.status(400).json({
                message: "Insufficient coins",
                required: product.price,
                available: user.coins
            });
        }

        // Require shipping address for merchandise
        if (product.category === "merchandise" && !shippingAddress) {
            return res.status(400).json({ message: "Shipping address required for merchandise" });
        }

        // Deduct coins
        user.coins -= product.price;

        // Handle premium redemption
        let premiumActivated = false;
        if (product.category === "premium" && product.premiumDays) {
            const now = new Date();
            const currentExpiry = user.premiumExpiresAt && user.premiumExpiresAt > now
                ? user.premiumExpiresAt
                : now;

            user.isPremium = true;
            user.premiumExpiresAt = new Date(currentExpiry.getTime() + product.premiumDays * 24 * 60 * 60 * 1000);
            premiumActivated = true;
        }

        // Handle Time Travel Pass redemption
        let timeTravelPassAdded = false;
        if (product.name.toLowerCase().includes("time travel")) {
            user.timeTravelPasses = (user.timeTravelPasses || 0) + 1;
            timeTravelPassAdded = true;
            console.log(`[Store] User ${user.name} purchased a Time Travel Pass. Total passes: ${user.timeTravelPasses}`);
        }

        await user.save();

        // Update stock
        if (product.stock !== -1) {
            product.stock -= 1;
        }
        product.totalRedemptions += 1;
        await product.save();

        // Create order
        const order = await StoreOrder.create({
            userId,
            productId: product._id,
            productName: product.name,
            productImage: product.image,
            coinsCost: product.price,
            status: product.category === "digital" || product.category === "premium" ? "completed" : "pending",
            shippingAddress: shippingAddress || null,
            premiumActivated
        });

        res.json({
            message: "Redemption successful!",
            order,
            newBalance: user.coins,
            premiumActivated
        });

    } catch (error) {
        console.error("Redeem product error:", error);
        res.status(500).json({ message: "Failed to redeem product" });
    }
};

/**
 * Get user's order history
 */
export const getUserOrders = async (req, res) => {
    try {
        const orders = await StoreOrder.find({ userId: req.user._id })
            .populate("productId")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error("Get orders error:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

/**
 * Get single order details
 */
export const getOrderById = async (req, res) => {
    try {
        const order = await StoreOrder.findOne({
            _id: req.params.id,
            userId: req.user._id
        }).populate("productId");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(order);
    } catch (error) {
        console.error("Get order error:", error);
        res.status(500).json({ message: "Failed to fetch order" });
    }
};

// ============ ADMIN FUNCTIONS ============

/**
 * Create a new product (Admin only)
 */
export const createProduct = async (req, res) => {
    try {
        const { name, description, image, price, category, stock, isFeatured, premiumDays, coinsReward } = req.body;

        if (!name || price === undefined) {
            return res.status(400).json({ message: "Name and price are required" });
        }

        const product = await StoreProduct.create({
            name,
            description,
            image,
            price,
            category,
            stock: stock ?? -1,
            isFeatured: isFeatured ?? false,
            premiumDays,
            coinsReward
        });

        res.status(201).json(product);
    } catch (error) {
        console.error("Create product error:", error);
        res.status(500).json({ message: "Failed to create product" });
    }
};

/**
 * Update a product (Admin only)
 */
export const updateProduct = async (req, res) => {
    try {
        const product = await StoreProduct.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        console.error("Update product error:", error);
        res.status(500).json({ message: "Failed to update product" });
    }
};

/**
 * Delete a product (Admin only)
 */
export const deleteProduct = async (req, res) => {
    try {
        const product = await StoreProduct.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({ message: "Failed to delete product" });
    }
};

/**
 * Get all orders (Admin only)
 */
export const getAllOrders = async (req, res) => {
    try {
        const { status } = req.query;

        const filter = {};
        if (status && status !== "all") {
            filter.status = status;
        }

        const orders = await StoreOrder.find(filter)
            .populate("userId", "name email")
            .populate("productId", "name")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error("Get all orders error:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

/**
 * Update order status (Admin only)
 */
export const updateOrderStatus = async (req, res) => {
    try {
        const { status, trackingNumber, notes } = req.body;

        const order = await StoreOrder.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    status,
                    ...(trackingNumber && { trackingNumber }),
                    ...(notes && { notes })
                }
            },
            { new: true }
        ).populate("userId", "name email");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(order);
    } catch (error) {
        console.error("Update order error:", error);
        res.status(500).json({ message: "Failed to update order" });
    }
};
