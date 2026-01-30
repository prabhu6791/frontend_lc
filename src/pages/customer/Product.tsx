import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { callApi } from "../../services/authService";
import Swal from "sweetalert2";
import { Pagination } from "antd";

// ================= TYPES =================

interface Product {
    id: number;
    product_name: string;
    price: number;
    count: number; // stock
}

interface CartItem extends Product {
    quantity: number;
}

interface ProductResponse {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
    data: Product[];
}

// ================= COMPONENT =================

const ProductCustomer: React.FC = () => {
    const user = localStorage.getItem("user");
    const userObj = user ? JSON.parse(user) : null;
    const role = userObj?.role || "customer";
    const userId = userObj?.id;

    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);

    // ✅ Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [totalRecords, setTotalRecords] = useState(0);

    useEffect(() => {
        loadProducts();
    }, [currentPage, pageSize]);

    // ================= LOAD PRODUCTS WITH PAGINATION =================

    const loadProducts = async () => {
        const res = await callApi<ProductResponse>(
            `/api/products?page=${currentPage}&limit=${pageSize}`,
            "GET"
        );

        if (res.success) {
            const data = res.data.map((p: any) => ({
                ...p,
                price: Number(p.price),
                count: Number(p.count),
            }));

            setProducts(data);
            setTotalRecords(res.totalRecords);
        }
    };

    // ================= PAGINATION =================

    const handlePageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        if (pageSize) setPageSize(pageSize);
    };

    // ================= CART LOGIC =================

    const addToCart = (product: Product) => {
        if (product.count === 0) {
            Swal.fire("Out of Stock", "Product not available", "error");
            return;
        }

        setCart(prev => {
            const exist = prev.find(p => p.id === product.id);

            if (exist) {
                if (exist.quantity + 1 > product.count) {
                    Swal.fire("Stock Limit", "Stock limit reached", "warning");
                    return prev;
                }

                return prev.map(p =>
                    p.id === product.id
                        ? { ...p, quantity: p.quantity + 1 }
                        : p
                );
            }

            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQty = (id: number, qty: number) => {
        if (qty < 1) return;

        const product = products.find(p => p.id === id);
        if (!product) return;

        if (qty > product.count) {
            Swal.fire("Stock Limit", `Only ${product.count} available`, "warning");
            return;
        }

        setCart(prev =>
            prev.map(p => (p.id === id ? { ...p, quantity: qty } : p))
        );
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(p => p.id !== id));
    };

    const totalAmount = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // ================= PLACE ORDER =================

    const placeOrder = async () => {
        if (cart.length === 0) {
            Swal.fire("Warning", "Cart is empty", "warning");
            return;
        }

        const items = cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
        }));

        const res = await callApi<any>("/api/orders", "POST", {
            user_id: userId,
            items,
        });

        if (res.success) {
            Swal.fire("Success", "Order placed successfully!", "success");
            setCart([]);
            loadProducts(); // reload stock
        } else {
            Swal.fire("Error", res.message, "error");
        }
    };

    // ================= UI =================

    return (
        <Layout role={role}>
            <div className="container py-4">
                <div className="row">
                    {/* PRODUCTS */}
                    <div className="col-lg-8">
                        <h3 className="mb-3">🛒 Products</h3>

                        <div className="row g-3">
                            {products.map(p => (
                                <div className="col-md-3" key={p.id}>
                                    <div className="card h-100 shadow-sm">
                                        <div className="card-body">
                                            <h6>{p.product_name}</h6>
                                            <p className="fw-bold text-primary">
                                                ₹{p.price}
                                            </p>

                                            <p className={`fw-bold ${p.count === 0 ? "text-danger" : "text-success"}`}>
                                                Stock: {p.count}
                                            </p>

                                            <button
                                                className="btn btn-primary w-100"
                                                disabled={p.count === 0}
                                                onClick={() => addToCart(p)}
                                            >
                                                {p.count === 0 ? "Out of Stock" : "Add to Cart"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ✅ PAGINATION UI */}
                        <div className="d-flex justify-content-end mt-4">
                            <Pagination
                                current={currentPage}
                                total={totalRecords}
                                pageSize={pageSize}
                                onChange={handlePageChange}
                                showSizeChanger
                            />
                        </div>
                    </div>

                    {/* CART */}
                    <div className="col-lg-4">
                        <h3 className="mb-3">🛍️ Cart</h3>
                        <div className="card shadow-sm">
                            <div className="card-body">
                                {cart.length === 0 ? (
                                    <p className="text-muted">Cart is empty</p>
                                ) : (
                                    <>
                                        {cart.map(item => (
                                            <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                                                <div>
                                                    <strong>{item.product_name}</strong>
                                                    <div className="text-muted">
                                                        ₹{item.price} × {item.quantity}
                                                    </div>
                                                </div>

                                                <div className="d-flex gap-1">
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        value={item.quantity}
                                                        className="form-control form-control-sm"
                                                        style={{ width: "60px" }}
                                                        onChange={e =>
                                                            updateQty(item.id, Number(e.target.value))
                                                        }
                                                    />
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => removeFromCart(item.id)}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <hr />
                                        <h5>Total: ₹{totalAmount.toFixed(2)}</h5>

                                        <button
                                            className="btn btn-success w-100 mt-2"
                                            onClick={placeOrder}
                                        >
                                            Place Order
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProductCustomer;
