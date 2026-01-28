import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";

interface TopbarProps {
    role: string;
}

const Topbar: React.FC<TopbarProps> = ({ role }) => {
    const handleLogout = () => {
        try {
            localStorage.clear();
            window.location.href = '/';
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };
    return (
        <Navbar bg="light" expand="lg" className="shadow-sm">
            <Container fluid>
                <Navbar.Brand>{role === "admin" ? "Admin Panel" : "User Dashboard"}</Navbar.Brand>
                <Nav className="ms-auto">
                    <Nav.Link href="#">Profile</Nav.Link>
                    <Nav.Link href="#" onClick={handleLogout}>
                        Logout
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default Topbar;
