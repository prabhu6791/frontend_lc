import { useState } from "react";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div
            className="container-fluid min-vh-100 d-flex align-items-center"
            style={{ backgroundColor: "#f8f9fa" }}
        >
            <div className="container">
                <div className="row shadow rounded-4 overflow-hidden bg-white">

                    {/* Left Side - Shopping Banner */}
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

                    {/* Right Side - Login Form */}
                    <div className="col-md-6 p-5">
                        <h4 className="mb-4 text-center text-primary fw-bold">
                            Login to your account
                        </h4>

                        <form>
                            {/* Username */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter username"
                                />
                            </div>

                            {/* Password */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Password</label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control"
                                        placeholder="Enter password"
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

                            {/* Buttons - Bootstrap Only */}
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
