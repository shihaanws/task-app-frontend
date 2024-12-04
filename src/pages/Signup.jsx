import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signupUser } from "../redux/slices/authSlice";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const { loading, error } = useSelector((state) => state.auth);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setValidationErrors(validationErrors); 

    if (Object.keys(validationErrors).length > 0) {
      toast.error(Object.values(validationErrors).join(" "));
      return;
    }

    try {
      await dispatch(signupUser(formData)).unwrap();
      toast.success("Signup successful! Redirecting to login...");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      navigate("/login");
    } catch (err) {
      toast.error(err || "Signup failed. Try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div
        className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg"
        role="main"
        aria-labelledby="signup-heading"
      >
        <h2
          id="signup-heading"
          className="text-3xl font-semibold text-center text-gray-800 mb-8"
        >
          Create Your Account
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
        <form onSubmit={handleSubmit} noValidate aria-describedby="form-errors">
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className={`w-full outline-none px-2 py-2 bg-transparent text-sm text-gray-700 border ${
                validationErrors.username ? "border-red-600" : "border-gray-300"
              } rounded-md`}
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              aria-required="true"
            />
            {validationErrors.username && (
              <p
                id="username-error"
                className="text-sm text-red-600 mt-1"
                role="alert"
                aria-live="assertive"
              >
                {validationErrors.username}
              </p>
            )}
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
              className={`w-full outline-none px-2 py-2 bg-transparent text-sm text-gray-700 border ${
                validationErrors.password ? "border-red-600" : "border-gray-300"
              } rounded-md`}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              aria-required="true"
              minLength={6}
            />
            {validationErrors.password && (
              <p
                id="password-error"
                className="text-sm text-red-600 mt-1"
                role="alert"
                aria-live="assertive"
              >
                {validationErrors.password}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Select Role
            </label>

            <select
              id="role"
              name="role"
              className=" select select-bordered bg-transparent text-sm text-gray-700 w-full border-gray-300 max-w-md"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              aria-required="true"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className={`w-full py-2 ${
              loading ? "bg-gray-400" : "bg-green-500"
            } text-white text-lg rounded-lg hover:bg-green-600 transition-colors`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                Signing Up{" "}
                <span className="loading loading-bars loading-sm"></span>
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login here.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
