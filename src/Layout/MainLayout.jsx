import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";

function Container({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="d-flex w-100 position-relative">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className="flex-grow-1"
        style={{
          marginLeft: sidebarOpen ? "260px" : "0",
          width: sidebarOpen ? "calc(100% - 260px)" : "100%",
          transition: "all 0.3s ease",
          position: "relative",
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        <Header toggleSidebar={toggleSidebar} />
        <div className="mainLayout-content p-3">{children}</div>
      </div>
    </div>
  );
}

export default Container;
