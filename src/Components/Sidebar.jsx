import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Collapse } from "react-bootstrap";
import { FaChevronDown, FaChevronUp, FaBars } from "react-icons/fa";

const sectionMap = {
  mock: ["/add", "/view"],
  packages: ["/package_add", "/package_view"],
  question: ["/add_question", "/view_question"],
  registration: ["/registration"],
};

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const [openSection, setOpenSection] = useState(null);
  const [activeItem, setActiveItem] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const currentSection = useMemo(() => {
    for (let key in sectionMap) {
      if (sectionMap[key].some((path) => location.pathname === path)) {
        return key;
      }
    }
    return null;
  }, [location.pathname]);

  useEffect(() => {
    if (currentSection !== openSection) setOpenSection(currentSection);
    setActiveItem(location.pathname);
  }, [currentSection, location.pathname]);

  useEffect(() => {
    // Update window width state on resize
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSection = (sectionName) => {
    setOpenSection((prev) => (prev === sectionName ? null : sectionName));
  };

  // Show tooltip icon only if sidebar closed and width < 768
  if (!sidebarOpen && windowWidth < 768) {
    return (
      <div
        className="sidebar-tooltip-icon"
        onClick={toggleSidebar}
        title="Open Menu"
        style={{
          position: "fixed",
          // top: 15,
          // left: 15,
          color: "#000000ff",
          padding: "5px",
          borderRadius: "50%",
          cursor: "pointer",
          zIndex: 1500,
          fontSize: "20px",
        }}
      >
        <FaBars />
      </div>
    );
  }

  return (
    <>
      <div
        className="sidebar bg-dark text-white p-3"
        style={{
          width: "260px",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          overflowY: "auto",
          zIndex: 1400,
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <img
            src="https://learnandachieve.in/assets/logo.png"
            alt="Learn and Achieve"
            className="img-fluid mb-2"
            style={{ width: "40px" }}
          />
          <span className="fs-5 fw-bold">Learn and Achieve</span>
          {/* Close button for mobile */}
          {/* {windowWidth < 768 && (
            <FaBars
              onClick={toggleSidebar}
              style={{ cursor: "pointer", color: "#ffc107" }}
              title="Close Menu"
            />
          )} */}
        </div>

        {/* Sections */}
        {Object.keys(sectionMap).map((key) => (
          <div key={key} className="mb-2">
            <div
              className="d-flex align-items-center justify-content-between p-2 rounded hover-style"
              onClick={() => toggleSection(key)}
              style={{ cursor: "pointer" }}
            >
              <Link
                to={sectionMap[key][1] || sectionMap[key][0]}
                className="fw-bold text-white text-decoration-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenSection(key);
                }}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Link>
              {openSection === key ? <FaChevronUp /> : <FaChevronDown />}
            </div>

            {openSection === key && (
              <Collapse in={true}>
                <div className="ms-3 mt-2 border-start border-secondary ps-2">
                  {sectionMap[key].map((path) => (
                    <Link
                      key={path}
                      to={path}
                      className={`sidebar-link d-block py-1 text-decoration-none ${
                        activeItem === path ? "active-link" : ""
                      }`}
                    >
                      {path
                        .split("_")
                        .pop()
                        .replace("/", "")
                        // .toUpperCase()
                        }
                    </Link>
                  ))}
                </div>
              </Collapse>
            )}
          </div>
        ))}
      </div>

      {/* Overlay on mobile to close sidebar when clicking outside */}
      {sidebarOpen && windowWidth < 768 && (
        <div
          className="sidebar-overlay"
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1300,
          }}
        />
      )}
    </>
  );
};

export default Sidebar;
