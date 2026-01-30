import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Pagination } from "antd";
import { callApi } from "../../services/authService";
import Swal from "sweetalert2";

// ================= TYPES =================

interface ProductForm {
    product_name: string;
    sku: string;
    price: string;
    description: string;
    brand: string;
    count: string;
    image: string;
}

interface Product {
    id: number;
    product_name: string;
    sku: string;
    price: number;
    description?: string;
    brand?: string;
    count?: number;
    image?: string;
    created_at?: string;
    status?: string;
}

interface ProductResponse {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
    data?: Product[];
}

// ================= COMPONENT =================

const ProductPage: React.FC = () => {
    const user = localStorage.getItem("user");
    const role = user ? JSON.parse(user).role : "admin";

    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const [formData, setFormData] = useState<ProductForm>({
        product_name: "",
        sku: "",
        price: "",
        description: "",
        brand: "",
        count: "",
        image: "",
    });

    // ================= LOAD PRODUCTS =================

    useEffect(() => {
        loadProducts();
    }, [currentPage, pageSize]);

    const loadProducts = async () => {
        try {
            const res = await callApi<ProductResponse>(
                `/api/products?page=${currentPage}&limit=${pageSize}`,
                "GET"
            );

            if (!res.success) throw new Error(res.message);

            setProducts(res.data || []);
            setTotalRecords(res.totalRecords);
            setPageSize(res.limit);
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Failed to load products", "error");
        }
    };

    // ================= PAGINATION =================

    const handlePageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        if (pageSize) setPageSize(pageSize);
    };

    // ================= MODAL =================

    const showModal = (product?: Product) => {
        if (product) {
            setFormData({
                product_name: product.product_name,
                sku: product.sku,
                price: product.price.toString(),
                description: product.description || "",
                brand: product.brand || "",
                count: product.count?.toString() || "0",
                image: product.image || "",
            });
            setEditingId(product.id);
        } else {
            setFormData({
                product_name: "",
                sku: "",
                price: "",
                description: "",
                brand: "",
                count: "",
                image: "",
            });
            setEditingId(null);
        }
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
        setEditingId(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ================= SUBMIT =================

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.product_name || !formData.sku || !formData.price) {
            Swal.fire("Warning", "Please fill required fields", "warning");
            return;
        }

        try {
            const apiPath = editingId
                ? `/api/products/${editingId}`
                : "/api/products";

            const method = editingId ? "PUT" : "POST";

            const res = await callApi<ProductResponse>(apiPath, method, formData);

            if (res.success) {
                Swal.fire("Success", editingId ? "Product Updated" : "Product Added", "success");
                handleCancel();
                loadProducts();
            } else {
                Swal.fire("Error", res.message, "error");
            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Server Error", "error");
        }
    };

    // ================= DELETE =================

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this product?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await callApi<ProductResponse>(`/api/products/${id}`, "DELETE");

            if (res.success) {
                Swal.fire("Deleted!", "Product deleted successfully", "success");
                loadProducts();
            } else {
                Swal.fire("Error", res.message, "error");
            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Server Error", "error");
        }
    };

    // ================= UI =================

    return (
        <Layout role={role}>
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Product List</h2>
                    <button className="btn btn-primary" onClick={() => showModal()}>
                        Add Product
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Name</th>
                                <th>SKU</th>
                                <th>Price</th>
                                <th>Brand</th>
                                <th>Stock</th>
                                <th>Created Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p, index) => (
                                <tr key={p.id}>
                                    <td>{(currentPage - 1) * pageSize + index + 1}</td>
                                    <td>{p.product_name}</td>
                                    <td>{p.sku}</td>
                                    <td>₹{p.price}</td>
                                    <td>{p.brand || "-"}</td>
                                    <td>{p.count}</td>
                                    <td>
                                        {p.created_at
                                            ? new Date(p.created_at).toLocaleDateString("en-GB")
                                            : "-"}
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-warning me-2" onClick={() => showModal(p)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="text-center">
                                        No products found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="d-flex justify-content-end">
                        <Pagination
                            current={currentPage}
                            total={totalRecords}
                            pageSize={pageSize}
                            onChange={handlePageChange}
                            showSizeChanger
                        />
                    </div>
                </div>
            </div>

            {/* ================= MODAL ================= */}
            <Modal
                title={editingId ? "Edit Product" : "Add Product"}
                open={open}
                onCancel={handleCancel}
                footer={null}
            >
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label>Product Name *</label>
                        <input
                            type="text"
                            name="product_name"
                            className="form-control"
                            value={formData.product_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label>SKU *</label>
                        <input
                            type="text"
                            name="sku"
                            className="form-control"
                            value={formData.sku}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label>Price *</label>
                        <input
                            type="number"
                            name="price"
                            className="form-control"
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label>Brand</label>
                        <input
                            type="text"
                            name="brand"
                            className="form-control"
                            value={formData.brand}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label>Stock Count</label>
                        <input
                            type="number"
                            name="count"
                            className="form-control"
                            value={formData.count}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label>Description</label>
                        <textarea
                            name="description"
                            className="form-control"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label>Image URL</label>
                        <input
                            type="text"
                            name="image"
                            className="form-control"
                            value={formData.image}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="text-end mt-3">
                        <button type="button" className="btn btn-secondary me-2" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {editingId ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default ProductPage;
