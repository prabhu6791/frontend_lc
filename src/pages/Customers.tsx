import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Pagination } from "antd";
import { callApi } from "../services/authService";
import Swal from "sweetalert2";

interface CustomerForm {
    name: string;
    email: string;
    username: string;
    password: string;
}

interface Customer {
    password: string;
    id: number;
    name: string;
    email: string;
    username: string;
    role?: string;
    created_at?: string;
}

interface CustomerResponse {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
    data?: Customer[];
}

const Customer: React.FC = () => {
    const user = localStorage.getItem("user");
    const role = user ? JSON.parse(user).role : "customer";

    const [open, setOpen] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [editingCustomerId, setEditingCustomerId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(5);

    const [formData, setFormData] = useState<CustomerForm>({
        name: "",
        email: "",
        username: "",
        password: "",
    });

    useEffect(() => {
        loadCustomers();
    }, [currentPage, pageSize]);

    const loadCustomers = async () => {
        try {
            const res = await callApi<CustomerResponse>(`/api/get-all-customers?page=${currentPage}&limit=${pageSize}`, "GET");
            if (!res.success) throw new Error(res.message);
            setCustomers(res.data || []);
            setTotalRecords(res.totalRecords);
            setPageSize(res.limit);
        } catch (error) {
            console.error("Error loading customers:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load customers. Please try again later.'
            });
        }
    };

    const handlePageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        if (pageSize) setPageSize(pageSize);
    };

    const showModal = (customer?: Customer) => {
        if (customer) {
            setFormData({
                name: customer.name,
                email: customer.email,
                username: customer.username,
                password: customer.password,
            });
            setEditingCustomerId(customer.id);
        } else {
            setFormData({ name: "", email: "", username: "", password: "" });
            setEditingCustomerId(null);
        }
        setOpen(true);
    };

    const handleCancel = () => {
        setFormData({ name: "", email: "", username: "", password: "" });
        setEditingCustomerId(null);
        setOpen(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.username) {
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'Please fill all required fields'
            });
            return;
        }

        try {
            const apiPath = editingCustomerId ? `/api/edit-customers/${editingCustomerId}` : "/api/customers";
            const method = editingCustomerId ? "PUT" : "POST";

            const res = await callApi<CustomerResponse>(apiPath, method, formData);

            if (res.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: editingCustomerId ? "Customer Updated Successfully" : "Customer Added Successfully"
                });
                handleCancel();
                loadCustomers();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: res.message
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Server Error'
            });
        }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You want to delete this customer?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (!result.isConfirmed) return;

        try {
            const res = await callApi<CustomerResponse>(`/api/delete-customers/${id}`, "DELETE");
            if (res.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Customer Deleted Successfully'
                });
                loadCustomers();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: res.message
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Server Error'
            });
        }
    };

    return (
        <Layout role={role}>
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Customer Page</h1>
                    <button className="btn btn-primary" onClick={() => showModal()}>
                        Add Customer
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>S No</th>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Created Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer, index) => (
                                <tr key={customer.id}>
                                    <td>{(currentPage - 1) * pageSize + index + 1}</td>
                                    <td>{customer.name}</td>
                                    <td>{customer.username}</td>
                                    <td>{customer.email}</td>
                                    <td>
                                        {customer.created_at
                                            ? new Date(customer.created_at).toLocaleDateString("en-GB")
                                            : "-"}
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-warning me-2" onClick={() => showModal(customer)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(customer.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {customers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center">
                                        No customers found.
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
                            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                        />
                    </div>
                </div>
            </div>

            <Modal
                title={editingCustomerId ? "Edit Customer" : "Add Customer"}
                open={open}
                onCancel={handleCancel}
                footer={null}
                maskClosable={false}
                keyboard={false}
            >
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="mb-3">
                        <label className="form-label">
                            Customer Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter customer name"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Email <span className="text-danger">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Username <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Password <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="form-control"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                required={!editingCustomerId}
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {editingCustomerId ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default Customer;
