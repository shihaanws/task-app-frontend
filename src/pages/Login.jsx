import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";

import { loginUser } from "../redux/slices/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(formData)).unwrap();
      navigate("/tasks");
      toast.success("Login successful!");
    } catch (err) {
      toast.error(err || "Login failed. Try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer />

      <div
        className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg"
        role="main"
        aria-labelledby="login-heading"
      >
        <h2
          id="login-heading"
          className="text-3xl font-semibold text-center text-gray-800 mb-8"
        >
          Login to Your Account
        </h2>
        {error && (
          <div
            role="alert"
            className="mb-4 text-red-600 text-center text-sm"
            aria-live="assertive"
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate aria-describedby="form-error">
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600 mb-2 bg-white"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full border border-gray-300 rounded-md p-2 bg-transparent" // Default styling
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
              aria-required="true"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full border border-gray-300 bg-transparent rounded-md p-2" // Default styling
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              aria-required="true"
              minLength="6"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 ${
              loading ? "bg-gray-400" : "bg-blue-500"
            } text-white text-lg rounded-lg hover:bg-blue-600 transition-colors`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                Logging in{" "}
                <span className="loading loading-bars loading-sm"></span>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-blue-500 hover:underline"
              role="link"
            >
              Signup
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
