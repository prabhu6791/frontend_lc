import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    adminOnly?: boolean; // optional role-based
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly }) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
        return <Navigate to="/" replace />; // Not logged in → go to login
    }

    let userObj;
    try {
        userObj = JSON.parse(user);
    } catch {
        return <Navigate to="/" replace />;
    }

    // Admin-only route
    if (adminOnly && userObj.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    // Prevent admin from going to user dashboard
    if (!adminOnly && userObj.role === "admin") {
        return <Navigate to="/admin" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
