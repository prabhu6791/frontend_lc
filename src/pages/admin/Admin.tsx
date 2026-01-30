import React from "react";
import Layout from "../../components/Layout";

const Admin: React.FC = () => {
  const user = localStorage.getItem("user");
  const role = user ? JSON.parse(user).role : "admin";

  return (
    <Layout role={role}>
      <h1>Welcome Admin</h1>
    </Layout>
  );
};

export default Admin;
