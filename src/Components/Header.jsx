import React, { useState, useRef, useEffect } from "react";
import { FiBell, FiLogOut } from "react-icons/fi";
import { FaUser, FaLock } from "react-icons/fa";
import { Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SessionManager from "../utils/SessionManager";
import RoutesPath from "../utils/RoutesPath";

const Header = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    SessionManager.shared.logout();
    navigate(RoutesPath.login);
  };

  const handleViewProfile = () => {
    navigate("/profile"); // replace with actual route
  };

  const handleChangePassword = () => {
    navigate("/change-password"); // replace with actual route
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      style={{ width: "100%", zIndex: "999" }}
      className="bg-white shadow-sm position-fixed"
    >
      <Navbar className="px-4 py-2">
        <div className="d-flex align-items-center w-100">
          {/* Left Side */}
          <div className="fw-bold fs-5 ms-3 text-truncate" ref={dropdownRef}>
            Welcome, Learn & Achieve!
          </div>

          {/* Right Side */}
          <div className="d-flex align-items-center gap-3 position-relative ms-auto" ref={dropdownRef}>
            {/* <FiBell size={22} style={{ cursor: "pointer" }} /> */}

            <img
              src="https://i.pinimg.com/736x/04/9d/cc/049dcc27092032f5f4b533c35ab3a59c.jpg"
              alt="Profile"
              className="rounded-circle"
              width="35"
              height="35"
              style={{ objectFit: "cover", cursor: "pointer" }}
              onClick={() => setShowDropdown((prev) => !prev)}
            />

            {/* Profile Dropdown */}
            {showDropdown && (
              <div
                className="bg-white shadow rounded p-3 position-absolute"
                style={{
                  top: "50px",
                  right: 0,
                  width: "220px",
                  zIndex: 1000,
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <img
                    src="https://i.pinimg.com/736x/04/9d/cc/049dcc27092032f5f4b533c35ab3a59c.jpg"
                    alt="Profile"
                    className="rounded-circle"
                    width="40"
                    height="40"
                  />
                  <div>
                    <div className="fw-bold">Learn & Achieve</div>
                    <small className="text-muted">Super Admin</small>
                  </div>
                </div>
                <hr className="my-2" />

                <div
                  className="d-flex align-items-center gap-2 py-1 text-dark"
                  style={{ cursor: "pointer" }}
                  onClick={handleViewProfile}
                >
                  <FaUser size={14} />
                  View Profile
                </div>

                <div
                  className="d-flex align-items-center gap-2 py-1 text-dark"
                  style={{ cursor: "pointer" }}
                  onClick={handleChangePassword}
                >
                  <FaLock size={14} />
                  Change Password
                </div>

                <hr className="my-2" />

                <div
                  className="d-flex align-items-center gap-2 text-danger fw-semibold"
                  style={{ cursor: "pointer" }}
                  onClick={handleLogout}
                >
                  <FiLogOut size={16} />
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </Navbar>
    </div>
  );
};

export default Header;
