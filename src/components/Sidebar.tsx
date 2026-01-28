import React from "react";
import { Nav } from "react-bootstrap";

interface SidebarProps {
  role: string;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const adminLinks = ["Dashboard", "Users", "Settings"];
  const userLinks = ["Home", "Orders", "Profile"];

  const links = role === "admin" ? adminLinks : userLinks;

  return (
    <div
      className="bg-dark text-white vh-100 p-3"
      style={{ width: "220px" }}
    >
      <h4 className="text-center">{role === "admin" ? "Admin" : "Customer"}</h4>
      <Nav className="flex-column">
        {links.map((link) => (
          <Nav.Link
            key={link}
            href="#"
            className="text-white"
            style={{ margin: "5px 0" }}
          >
            {link}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;
