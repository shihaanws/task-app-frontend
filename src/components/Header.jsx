import React from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn text-xl">Task Dashboard</a>
      </div>
      {token && (
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 p-2 shadow"
            >
              <li>
                <a href="/userprofile" className="justify-between">
                  Profile
                </a>
              </li>

              <li>
                <a onClick={handleLogout}>Logout</a>{" "}
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
