import React from "react";
import Layout from "../components/Layout";
import 'bootstrap/dist/css/bootstrap.min.css';

const Customer: React.FC = () => {
    const user = localStorage.getItem("user");
    const role = user ? JSON.parse(user).role : "customer";

    return (
        <Layout role={role}>
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Customer Page</h1>
                    <button className="btn btn-primary">Add Customer</button>
                </div>
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>S.no</th>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Password</th>
                            <th>Created Date</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default Customer;
