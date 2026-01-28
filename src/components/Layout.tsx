import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface LayoutProps {
  children: React.ReactNode;
  role: string;
}

const Layout: React.FC<LayoutProps> = ({ children, role }) => {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main content */}
      <div className="flex-grow-1">
        <Topbar role={role} />
        <div className="container mt-3">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
