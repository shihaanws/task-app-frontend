import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { userDetail } from "../redux/slices/authSlice";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await dispatch(userDetail()).unwrap();
        console.log("ress", res);

        setUserDetails(res.data);
        setLoading(false);
      } catch (err) {
        if (err.status == 401) {
          navigate("/login");
        }

        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-100">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-100">
      <div className="flex gap-4 absolute top-4 left-4">
        <button className="btn btn-ghost" onClick={() => navigate("/tasks")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Back to All Tasks
        </button>
      </div>

      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            User Profile
          </h2>

          <div className="mb-4">
            <div className="text-sm font-medium text-gray-400">Username</div>
            <div className="text-lg text-gray-800">
              {userDetails.username.charAt(0).toUpperCase() +
                userDetails.username.slice(1).toLowerCase()}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm font-medium text-gray-400">Role</div>
            <div className="text-lg text-gray-800">
              {userDetails.role.charAt(0).toUpperCase() +
                userDetails.role.slice(1).toLowerCase()}
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                dispatch({ type: "LOGOUT" });
                navigate("/login");
              }}
              className="w-full py-2 bg-red-500 text-white text-lg rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
