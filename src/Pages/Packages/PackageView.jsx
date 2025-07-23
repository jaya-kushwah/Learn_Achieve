import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaTrash, FaPen, FaPlus } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { InputGroup, FormControl, Button, ButtonGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import MainLayout from "../../Layout/MainLayout";
import PopupModal from "../../Components/resusable/PopupModal";
import PaginationButton from "../../Components/resusable/PaginationButton";

const initialPackageData = [
  { id: 1, name: "Testing", class: "12th", medium: "English", status: true },
  {
    id: 2,
    name: "Testing Package",
    class: "11th",
    medium: "English",
    status: true,
  },
  {
    id: 3,
    name: "Mock Test series",
    class: "9th",
    medium: "Semi English",
    status: false,
  },
  {
    id: 4,
    name: "BHARAT SAT EXAM - 11th CLASS PACKAGE",
    class: "14th",
    medium: "English",
    status: true,
  },
  {
    id: 5,
    name: "7th Feb Bharat SAT",
    class: "7th",
    medium: "English",
    status: true,
  },
  {
    id: 6,
    name: "7th Feb Bharat SAT",
    class: "8th",
    medium: "English",
    status: true,
  },
  {
    id: 7,
    name: "7th Feb Bharat SAT",
    class: "9th",
    medium: "English",
    status: true,
  },
  {
    id: 8,
    name: "7th Feb Bharat SAT",
    class: "12th",
    medium: "English",
    status: true,
  },
  {
    id: 9,
    name: "7th Feb Bharat SAT",
    class: "12th",
    medium: "English",
    status: true,
  },
  {
    id: 10,
    name: "7th Feb Bharat SAT",
    class: "12th",
    medium: "English",
    status: true,
  },
];

const PackageView = () => {
  const [packages, setPackages] = useState(initialPackageData);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const rowsPerPage = 5;
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentPackages = packages.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(packages.length / rowsPerPage);

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedIds([]);
  };

  const confirmToggleStatus = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleStatusChangeConfirmed = () => {
    const updated = packages.map((pkg) =>
      pkg.id === selectedId ? { ...pkg, status: !pkg.status } : pkg
    );
    setPackages(updated);
    setShowModal(false);
    setSelectedId(null);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allVisibleIds = currentPackages.map((pkg) => pkg.id);
      setSelectedIds(allVisibleIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleCheckboxChange = (e, id) => {
    if (e.target.checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    }
  };

  return (
    <MainLayout>
      <div
        className="p-4"
        style={{
            marginTop: "4%",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold mb-0">PACKAGES</h5>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item text-dark">Dashboard</li>
              <li
                style={{ color: " #1544b1" }}
                className="breadcrumb-item active"
              >
                Add Packages
              </li>
            </ol>
          </nav>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h5 className="mb-2">Packages List</h5>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <button
                style={{ backgroundColor: "#ffe6e6", border: "none" }}
                className="btn btn-light text-danger"
                disabled={selectedIds.length === 0}
              >
                <RiDeleteBin5Line style={{ marginTop: "-4px" }} />
              </button>

              <InputGroup
                style={{
                  width: "32%",
                  height: "45px",
                  backgroundColor: "#f5f8fa",
                  borderRadius: "10px",
                  marginLeft: "40%",
                  overflow: "hidden",
                }}
              >
                <FormControl
                  placeholder="Search mock test name"
                  style={{
                    backgroundColor: "#f5f8fa",
                    border: "none",
                    outline: "none",
                    boxShadow: "none",
                  }}
                />
                <InputGroup.Text
                  style={{ backgroundColor: "#f5f8fa", border: "none" }}
                >
                  <FaSearch />
                </InputGroup.Text>
              </InputGroup>

              <Link to="/package_add" style={{ textDecoration: "none" }}>
                <ButtonGroup>
                  <Button
                    style={{
                      backgroundColor: "#1544b1",
                      border: "none",
                      height: "40px",
                      fontWeight: "500",
                      pointerEvents: "none",
                    }}
                  >
                    Add Packages
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "#1665d8",
                      border: "none",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaPlus />
                  </Button>
                </ButtonGroup>
              </Link>
            </div>

            {/* Table */}
            <table className="table align-middle table-hover">
              <thead style={{ backgroundColor: "#e6f7ff" }}>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length === currentPackages.length &&
                        currentPackages.length > 0
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="fw-bold">Sr No.</th>
                  <th className="fw-bold">Package Name</th>
                  <th className="fw-bold">Class</th>
                  <th className="fw-bold">Medium</th>
                  <th className="fw-bold">Current Status</th>
                  <th className="fw-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentPackages.map((pkg, index) => (
                  <tr key={pkg.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(pkg.id)}
                        onChange={(e) => handleCheckboxChange(e, pkg.id)}
                      />
                    </td>
                    <td>{indexOfFirst + index + 1}</td>
                    <td>{pkg.name}</td>
                    <td>{pkg.class}</td>
                    <td>{pkg.medium}</td>
                    <td>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={pkg.status}
                          onChange={() => confirmToggleStatus(pkg.id)}
                          style={{
                            backgroundColor: pkg.status ? "#1544b1" : "#ccc",
                            borderColor: pkg.status ? "#1544b1" : "#ccc",
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm me-2"
                        style={{
                          backgroundColor: "#e6fff0",
                          color: "#28a745",
                        }}
                      >
                        <FaPen />
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{
                          backgroundColor: "#ffe6e6",
                          color: "#dc3545",
                        }}
                      >
                        <RiDeleteBin5Line />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Reusable Popup */}
            <PopupModal
              show={showModal}
              onHide={() => setShowModal(false)}
              onConfirm={handleStatusChangeConfirmed}
            />

            {/* Reusable Paggination */}
            <PaginationButton
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            ></PaginationButton>
          </div>
        </div>
      </div>
      {/* </div>
      </div> */}
    </MainLayout>
  );
};

export default PackageView;
