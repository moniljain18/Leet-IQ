import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import {
    PackageIcon,
    PlusIcon,
    EditIcon,
    TrashIcon,
    Loader2Icon,
    ClipboardListIcon,
    TruckIcon,
    CheckCircleIcon,
    XCircleIcon,
    CoinsIcon,
    CrownIcon,
    ShoppingBagIcon,
    GiftIcon
} from "lucide-react";
import ConfirmModal from "../ConfirmModal";

function StoreManagement() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();
    const [activeSection, setActiveSection] = useState("products");
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        name: "",
        description: "",
        image: "",
        price: 100,
        category: "merchandise",
        stock: -1,
        isFeatured: false,
        premiumDays: null
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Fetch products
    const { data: products = [], isLoading: productsLoading } = useQuery({
        queryKey: ["admin-store-products"],
        queryFn: async () => {
            const token = await getToken();
            const res = await axiosInstance.get("/admin/store/products", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }
    });

    // Fetch orders
    const { data: orders = [], isLoading: ordersLoading } = useQuery({
        queryKey: ["admin-store-orders"],
        queryFn: async () => {
            const token = await getToken();
            const res = await axiosInstance.get("/admin/store/orders", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }
    });

    // Create product mutation
    const createProductMutation = useMutation({
        mutationFn: async (productData) => {
            const token = await getToken();
            return axiosInstance.post("/admin/store/products", productData, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            toast.success("Product created successfully!");
            queryClient.invalidateQueries(["admin-store-products"]);
            resetForm();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to create product");
        }
    });

    // Update product mutation
    const updateProductMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            const token = await getToken();
            return axiosInstance.put(`/admin/store/products/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            toast.success("Product updated successfully!");
            queryClient.invalidateQueries(["admin-store-products"]);
            resetForm();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update product");
        }
    });

    // Delete product mutation
    const deleteProductMutation = useMutation({
        mutationFn: async (id) => {
            const token = await getToken();
            return axiosInstance.delete(`/admin/store/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            toast.success("Product deleted!");
            queryClient.invalidateQueries(["admin-store-products"]);
            setShowDeleteModal(false);
            setSelectedProduct(null);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to delete product");
        }
    });

    // Update order status mutation
    const updateOrderMutation = useMutation({
        mutationFn: async ({ id, status, trackingNumber }) => {
            const token = await getToken();
            return axiosInstance.put(`/admin/store/orders/${id}`, { status, trackingNumber }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            toast.success("Order updated!");
            queryClient.invalidateQueries(["admin-store-orders"]);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update order");
        }
    });

    const resetForm = () => {
        setProductForm({
            name: "",
            description: "",
            image: "",
            price: 100,
            category: "merchandise",
            stock: -1,
            isFeatured: false,
            premiumDays: null
        });
        setEditingProduct(null);
        setShowProductModal(false);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name,
            description: product.description || "",
            image: product.image || "",
            price: product.price,
            category: product.category,
            stock: product.stock,
            isFeatured: product.isFeatured,
            premiumDays: product.premiumDays
        });
        setShowProductModal(true);
    };

    const handleSubmitProduct = (e) => {
        e.preventDefault();
        if (editingProduct) {
            updateProductMutation.mutate({ id: editingProduct._id, data: productForm });
        } else {
            createProductMutation.mutate(productForm);
        }
    };

    const handleDeleteProduct = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        deleteProductMutation.mutate(selectedProduct._id);
    };

    const handleCancelOrder = (order) => {
        setSelectedOrder(order);
        setShowCancelOrderModal(true);
    };

    const handleCancelOrderConfirm = () => {
        updateOrderMutation.mutate({ id: selectedOrder._id, status: "cancelled" });
        setShowCancelOrderModal(false);
        setSelectedOrder(null);
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case "premium": return <CrownIcon className="size-4 text-warning" />;
            case "merchandise": return <ShoppingBagIcon className="size-4 text-info" />;
            case "digital": return <GiftIcon className="size-4 text-success" />;
            default: return <PackageIcon className="size-4" />;
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: "badge-ghost",
            processing: "badge-warning",
            shipped: "badge-info",
            delivered: "badge-success",
            completed: "badge-success",
            cancelled: "badge-error"
        };
        return styles[status] || "badge-ghost";
    };

    return (
        <div className="space-y-6">
            {/* Section Tabs */}
            <div className="flex gap-4">
                <button
                    onClick={() => setActiveSection("products")}
                    className={`btn gap-2 ${activeSection === "products" ? "btn-primary" : "btn-ghost"}`}
                >
                    <PackageIcon className="size-4" />
                    Products ({products.length})
                </button>
                <button
                    onClick={() => setActiveSection("orders")}
                    className={`btn gap-2 ${activeSection === "orders" ? "btn-primary" : "btn-ghost"}`}
                >
                    <ClipboardListIcon className="size-4" />
                    Orders ({orders.length})
                </button>
            </div>

            {/* Products Section */}
            {activeSection === "products" && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold">Store Products</h3>
                        <button
                            onClick={() => setShowProductModal(true)}
                            className="btn btn-primary btn-sm gap-2"
                        >
                            <PlusIcon className="size-4" />
                            Add Product
                        </button>
                    </div>

                    {productsLoading ? (
                        <div className="flex justify-center py-10">
                            <Loader2Icon className="size-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Redemptions</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product._id}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg bg-base-300 flex items-center justify-center overflow-hidden">
                                                        {product.image ? (
                                                            <img src={product.image} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            getCategoryIcon(product.category)
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">{product.name}</div>
                                                        <div className="text-xs opacity-50 line-clamp-1">{product.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-1">
                                                    {getCategoryIcon(product.category)}
                                                    <span className="capitalize">{product.category}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-1 text-amber-500 font-bold">
                                                    <CoinsIcon className="size-3" />
                                                    {product.price}
                                                </div>
                                            </td>
                                            <td>{product.stock === -1 ? "Unlimited" : product.stock}</td>
                                            <td>{product.totalRedemptions || 0}</td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditProduct(product)}
                                                        className="btn btn-ghost btn-xs"
                                                    >
                                                        <EditIcon className="size-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(product)}
                                                        className="btn btn-ghost btn-xs text-error"
                                                        disabled={deleteProductMutation.isPending}
                                                    >
                                                        <TrashIcon className="size-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Orders Section */}
            {activeSection === "orders" && (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold">Customer Orders</h3>

                    {ordersLoading ? (
                        <div className="flex justify-center py-10">
                            <Loader2Icon className="size-8 animate-spin text-primary" />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-10 opacity-60">No orders yet</div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order._id} className="bg-base-100 rounded-xl p-4 border border-base-300">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="font-bold">{order.productName}</span>
                                                <span className={`badge ${getStatusBadge(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="text-sm opacity-60 space-y-1">
                                                <p>Customer: {order.userId?.name || "Unknown"} ({order.userId?.email})</p>
                                                <p>Order ID: {order._id}</p>
                                                <p className="flex items-center gap-1">
                                                    <CoinsIcon className="size-3 text-amber-500" />
                                                    {order.coinsCost} coins
                                                </p>
                                                {order.shippingAddress?.street && (
                                                    <p className="flex items-center gap-1">
                                                        <TruckIcon className="size-3" />
                                                        {order.shippingAddress.city}, {order.shippingAddress.country}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {order.status === "pending" && (
                                                <button
                                                    onClick={() => updateOrderMutation.mutate({ id: order._id, status: "processing" })}
                                                    className="btn btn-warning btn-sm"
                                                >
                                                    Mark Processing
                                                </button>
                                            )}
                                            {order.status === "processing" && (
                                                <button
                                                    onClick={() => {
                                                        const tracking = prompt("Enter tracking number (optional):");
                                                        updateOrderMutation.mutate({
                                                            id: order._id,
                                                            status: "shipped",
                                                            trackingNumber: tracking || undefined
                                                        });
                                                    }}
                                                    className="btn btn-info btn-sm"
                                                >
                                                    <TruckIcon className="size-4" />
                                                    Mark Shipped
                                                </button>
                                            )}
                                            {order.status === "shipped" && (
                                                <button
                                                    onClick={() => updateOrderMutation.mutate({ id: order._id, status: "delivered" })}
                                                    className="btn btn-success btn-sm"
                                                >
                                                    <CheckCircleIcon className="size-4" />
                                                    Mark Delivered
                                                </button>
                                            )}
                                            {!["delivered", "completed", "cancelled"].includes(order.status) && (
                                                <button
                                                    onClick={() => handleCancelOrder(order)}
                                                    className="btn btn-ghost btn-sm text-error"
                                                >
                                                    <XCircleIcon className="size-4" />
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Product Modal */}
            {showProductModal && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-lg">
                        <h3 className="font-bold text-lg mb-4">
                            {editingProduct ? "Edit Product" : "Add New Product"}
                        </h3>
                        <form onSubmit={handleSubmitProduct} className="space-y-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Product Name *</span></label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={productForm.name}
                                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Description</span></label>
                                <textarea
                                    className="textarea textarea-bordered"
                                    value={productForm.description}
                                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Image URL</span></label>
                                <input
                                    type="url"
                                    className="input input-bordered"
                                    value={productForm.image}
                                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Price (Coins) *</span></label>
                                    <input
                                        type="number"
                                        className="input input-bordered"
                                        value={productForm.price}
                                        onChange={(e) => setProductForm({ ...productForm, price: parseInt(e.target.value) })}
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label"><span className="label-text">Category</span></label>
                                    <select
                                        className="select select-bordered"
                                        value={productForm.category}
                                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                    >
                                        <option value="merchandise">Merchandise</option>
                                        <option value="digital">Digital</option>
                                        <option value="premium">Premium</option>
                                        <option value="featured">Featured</option>
                                        <option value="earn">Earn LeetCoin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Stock (-1 = unlimited)</span></label>
                                    <input
                                        type="number"
                                        className="input input-bordered"
                                        value={productForm.stock}
                                        onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })}
                                    />
                                </div>

                                {productForm.category === "premium" && (
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Premium Days</span></label>
                                        <input
                                            type="number"
                                            className="input input-bordered"
                                            value={productForm.premiumDays || ""}
                                            onChange={(e) => setProductForm({ ...productForm, premiumDays: parseInt(e.target.value) || null })}
                                            placeholder="30"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-3">
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-primary"
                                        checked={productForm.isFeatured}
                                        onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                                    />
                                    <span className="label-text">Featured Product</span>
                                </label>
                            </div>

                            <div className="modal-action">
                                <button type="button" className="btn btn-ghost" onClick={resetForm}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={createProductMutation.isPending || updateProductMutation.isPending}
                                >
                                    {(createProductMutation.isPending || updateProductMutation.isPending) ? (
                                        <Loader2Icon className="size-4 animate-spin" />
                                    ) : editingProduct ? (
                                        "Update Product"
                                    ) : (
                                        "Create Product"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-backdrop bg-black/50" onClick={resetForm} />
                </div>
            )}

            {/* Delete Product Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedProduct(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Product"
                message={`Are you sure you want to delete "${selectedProduct?.name}"?`}
                confirmText="Delete"
                variant="error"
                isLoading={deleteProductMutation.isPending}
            />

            {/* Cancel Order Confirmation Modal */}
            <ConfirmModal
                isOpen={showCancelOrderModal}
                onClose={() => {
                    setShowCancelOrderModal(false);
                    setSelectedOrder(null);
                }}
                onConfirm={handleCancelOrderConfirm}
                title="Cancel Order"
                message={`Are you sure you want to cancel the order for "${selectedOrder?.productName}"? The customer's coins will NOT be refunded.`}
                confirmText="Cancel Order"
                variant="warning"
                isLoading={updateOrderMutation.isPending}
            />
        </div>
    );
}

export default StoreManagement;
