"use client";

import authService from "../../services/authService";

import { useState } from "react";



export default function Login() {
    const [user, setUser] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };


    const handleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            setLoading(true);
            const loggedUser = await authService.login(user.username, user.password);
            alert(`Welcome, ${loggedUser.full_name || loggedUser.username}`);
            window.location.href = "/dashboard";
        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };





    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f9fa] px-4 sm:px-0">

            <div
                className="w-full sm:max-w-[360px] bg-[var(--color-bg-default)] rounded-[5px] 
               border-2 border-[var(--color-border-default)] 
               shadow-[1px_1px_4px_var(--color-border-default)]"
            >
                <div className="p-[40px] sm:p-8 flex flex-col items-center">
                    {/* Logo */}
                    <img
                        src="/kite-logo.svg"
                        alt="Zerodha Logo"
                        className="w-[60px] h-[60px]  "
                    />

                    {/* Title */}
                    <div className="text-2xl font-normal text-gray-800 my-5 text-center">
                        Login to Kite
                    </div>

                    {/* Input & Button Section */}
                    <div className="flex flex-col w-full space-y-6 sm:space-y-8">
                        {/* User ID Field */}
                        <div className="relative w-full">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={user.username}
                                onChange={handleChange}
                                placeholder=" "
                                autoComplete="off"
                                className="peer h-11 w-full rounded-[3px] border border-[#ddd] bg-transparent px-3 text-[#444]
                       focus:border-[#aaa] focus:outline-none autofill:bg-transparent appearance-none"
                            />
                            <label
                                htmlFor="userid"
                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-[#9B9B9B] text-base transition-all duration-200
                       peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
                       peer-focus:top-0 peer-focus:-translate-y-[50%] peer-focus:text-[11px] peer-focus:text-[#444]
                       peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:-translate-y-[50%]
                       peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:text-[#444]
                       before:content-[''] before:absolute before:left-1 before:right-0 before:top-1/2 before:-translate-y-1/2 
                       before:h-2 before:bg-white before:z-[-1]"
                            >
                                User ID
                            </label>
                        </div>

                        {/* Password Field */}
                        <div className="relative w-full">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                placeholder=" "
                                autoComplete="new-password"
                                className="peer h-11 w-full rounded-[3px] border border-[#ddd] bg-transparent px-3 text-[#444]
                       focus:border-[#aaa] focus:outline-none autofill:bg-transparent appearance-none"
                            />
                            <label
                                htmlFor="password"
                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-[#9B9B9B] text-base transition-all duration-200
                       peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
                       peer-focus:top-0 peer-focus:-translate-y-[50%] peer-focus:text-[11px] peer-focus:text-[#444]
                       peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:-translate-y-[50%]
                       peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:text-[#444]
                       before:content-[''] before:absolute before:left-1 before:right-0 before:top-1/2 before:-translate-y-1/2 
                       before:h-2 before:bg-white before:z-[-1]"
                            >
                                Password
                            </label>
                        </div>
                        {error && (
                            <div className="text-sm text-red-600 text-center">{error}</div>
                        )}
                        {/* Login Button */}
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full bg-[#387ed1] hover:bg-[#2d6db8] text-white text-md font-medium py-2 rounded-[2px] transition-colors duration-200"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>

                    {/* Forgot Password */}
                    <div className="text-xs text-gray-500 w-full text-center py-2">
                        <a href="#" className="text-[#9B9B9B] hover:text-[#575555]">
                            Forgot password?
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <p className="text-[#9B9B9B] hover:text-[#575555] font-medium mt-6">
                Maxence Infotech
            </p>
        </div>

    );
}
