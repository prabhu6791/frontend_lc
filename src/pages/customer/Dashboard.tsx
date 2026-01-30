import React from "react";
import Layout from "../../components/Layout";

const Dashboard: React.FC = () => {
    const user = localStorage.getItem("user");
    const role = user ? JSON.parse(user).role : "customer";

    return (
        <Layout role={role}>
            <h1>Welcome to Dashboard</h1>
        </Layout>
    );
};

export default Dashboard;
