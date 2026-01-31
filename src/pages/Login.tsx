import { useState } from "react";
import { callApi } from "../services/authService";
import Swal from "sweetalert2";

interface LoginResponse {
    user: {
        id: string;
        username: string;
        role: string;
    };
    token: string;
    success: boolean;
    message: string;
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

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [showRegPassword, setShowRegPassword] = useState(false);
    const [regUsername, setRegUsername] = useState("");
    const [regName, setRegName] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            Swal.fire("Error!", "Please enter both username and password", "error");
            return;
        }

        try {
            const res = await callApi<LoginResponse>(
                "/api/login",
                "POST",
                { username, password }
            );

            console.log("Response:", res);

            if (res.success && res.token && res.user) {
                localStorage.setItem("token", res.token);

                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        id: res.user.id,
                        username: res.user.username,
                        role: res.user.role
                    })
                );

                // Show success message and redirect after it's closed
                await Swal.fire({
                    title: "Success!",
                    text: "Login successful",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });

                // Redirect based on role using template literal
                const redirectPath = res.user.role === "admin" ? "/admin" : "/dashboard";
                window.location.href = redirectPath;
            } else {
                Swal.fire("Error!", res.message, "error");
            }

        } catch (err) {
            console.error(err);
            Swal.fire("Error!", "Server Error", "error");
        }
    };

    const handleNew = () => {
        setShowRegistration(true);
    };

    const handleBackToLogin = () => {
        setShowRegistration(false);
    };



    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all required fields
        const requiredFields = {
            username: regUsername.trim(),
            name: regName.trim(),
            email: regEmail.trim(),
            password: regPassword.trim()
        };

        const emptyFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (emptyFields.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: `Please fill in the following required fields: ${emptyFields.join(', ')}`
            });
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(requiredFields.email)) {
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'Please enter a valid email address'
            });
            return;
        }

        // Validate password strength
        if (requiredFields.password.length < 8) {
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'Password must be at least 8 characters long'
            });
            return;
        }

        try {
            const res = await callApi<CustomerResponse>("/api/customers", "POST", requiredFields);

            if (res.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: "Account created successfully"
                });
                setRegUsername('');
                setRegName('');
                setRegEmail('');
                setRegPassword('');
                setShowRegistration(false);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: res.message || 'Registration failed'
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Server error occurred. Please try again later.'
            });
        }
    };



    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center"
            style={{ backgroundColor: "#f8f9fa" }}
        >
            <div className="container">
                <div className="row shadow rounded-4 overflow-hidden bg-white">

                    {/* Left Side */}
                    <div
                        className="col-md-6 d-none d-md-flex flex-column justify-content-center p-5"
                        style={{
                            background: "linear-gradient(135deg, #1e3c72, #2a5298)",
                            color: "white"
                        }}
                    >
                        <h2 className="fw-bold">ShopEasy 🛍️</h2>
                        <p className="mt-2">
                            Best place to buy your favorite products online.
                        </p>
                        <ul className="mt-3">
                            <li>✔ Fast Delivery</li>
                            <li>✔ Best Prices</li>
                            <li>✔ Secure Payments</li>
                        </ul>
                    </div>

                    {/* Right Side */}
                    <div className="col-md-6 p-5">

                        {!showRegistration ? (
                            <>
                                <h4 className="mb-4 text-center text-primary fw-bold">
                                    Login to your account
                                </h4>

                                <form onSubmit={handleLogin}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Username <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Password <span className="text-danger">*</span></label>
                                        <div className="input-group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control"
                                                placeholder="Enter password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
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

                                    <button type="submit" className="btn btn-primary w-100 mb-2">
                                        Login
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-primary w-100"
                                        onClick={handleNew}
                                    >
                                        Create New Account
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <h4 className="mb-4 text-center text-success fw-bold">
                                    Create New Account
                                </h4>

                                {/* Registration Form */}
                                <form onSubmit={handleRegister}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Username <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter username"
                                            value={regUsername}
                                            onChange={(e) => setRegUsername(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Name <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter name"
                                            value={regName}
                                            onChange={(e) => setRegName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Email <span className="text-danger">*</span></label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter email"
                                            value={regEmail}
                                            onChange={(e) => setRegEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Password <span className="text-danger">*</span></label>

                                        <div className="input-group">
                                            <input
                                                type={showRegPassword ? "text" : "password"}
                                                className="form-control"
                                                placeholder="Enter password"
                                                value={regPassword}
                                                onChange={(e) => setRegPassword(e.target.value)}
                                                required
                                            />

                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => setShowRegPassword(!showRegPassword)}
                                            >
                                                {showRegPassword ? "Hide" : "Show"}
                                            </button>
                                        </div>
                                    </div>


                                    <button type="submit" className="btn btn-success w-100 mb-2">
                                        Register
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary w-100"
                                        onClick={handleBackToLogin}
                                    >
                                        Back to Login
                                    </button>
                                </form>

                            </>
                        )}

                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
