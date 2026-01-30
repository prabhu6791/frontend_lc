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

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

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
                        <h4 className="mb-4 text-center text-primary fw-bold">
                            Login to your account
                        </h4>

                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Password</label>
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

                            <button type="button" className="btn btn-outline-primary w-100">
                                Create New Account
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
