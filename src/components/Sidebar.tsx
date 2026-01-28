import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  role: string;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  // Define links with paths
  const adminLinks = [
    { name: "Dashboard", path: "/admin" },
    { name: "Customer", path: "/admin/customer-control" },
    { name: "Product", path: "/admin/products" },
    { name: "Settings", path: "/admin/settings" },
  ];

  const userLinks = [
    { name: "Home", path: "/dashboard" },
    { name: "Orders", path: "/orders" },
    { name: "Profile", path: "/profile" },
  ];

  const links = role === "admin" ? adminLinks : userLinks;

  return (
    <div
      className="bg-dark text-white vh-100 p-3"
      style={{ width: "220px" }}
    >
      <h4 className="text-center">{role === "admin" ? "Admin" : "Customer"}</h4>
      <Nav className="flex-column">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }: { isActive: boolean }) =>
              isActive ? "nav-link text-white active-link" : "nav-link text-white"
            }
            style={{ margin: "5px 0" }}
          >
            {link.name}
          </NavLink>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;
