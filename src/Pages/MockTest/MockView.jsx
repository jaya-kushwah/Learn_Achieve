import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaTrash, FaPen, FaPlus } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { InputGroup, FormControl, Button, ButtonGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../Layout/MainLayout";
import PopupModal from "../../Components/resusable/PopupModal";
import SessionManager from "../../utils/SessionManager";
import PaginationButton from "../../Components/resusable/PaginationButton";
import MockApiServices from "../../services/MockApiServices";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RoutesPath from "../../utils/RoutesPath";

const MockView = () => {
  const [mockData, setMockData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const rowsPerPage = 5;
  const navigate = useNavigate();

  const fetchMockTests = async () => {
  try {
    const token = SessionManager.shared.getSessionToken();
    const offset = (currentPage - 1) * rowsPerPage;

    const response = await MockApiServices.getPaginatedMockTests(
      query,
      rowsPerPage,
      offset,
      token
    );

    const mockTestsWithCount = response.mockTests.map((mock) => ({
      ...mock,
      packageCount: mock.packageCount || 0,
    }));

    setMockData(mockTestsWithCount);
    setTotalCount(response.total || 0);
    setSelectedIds([]);
  } catch (error) {
    toast.error(error.message || "Failed to fetch mock tests");
  }
};


  useEffect(() => {
    fetchMockTests();
  }, [currentPage, query]);

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const handleStatusChangeConfirmed = async () => {
    try {
      // const token = Cookies.get("token");
      const token = SessionManager.shared.getSessionToken();
      const test = mockData.find((t) => t._id === selectedId);
      const newStatus = test.status === "active" ? "inactive" : "active";
      await MockApiServices.changeMockTestStatus(selectedId, newStatus, token);

      toast.success(`Mock test status changed to ${newStatus}`);
      setShowModal(false);
      setSelectedId(null);
      fetchMockTests();
    } catch (error) {
      toast.error(error.message || "Failed to update status");
      setShowModal(false);
      setSelectedId(null);
    }
  };

  const confirmToggleStatus = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? mockData.map((test) => test._id) : []);
  };

  const handleCheckboxChange = (id, checked) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  const deleteMockTests = async (ids) => {
    // const token = Cookies.get("token");
    const token = SessionManager.shared.getSessionToken();
    const toastId = toast.loading("Deleting mock test(s)...");

    try {
      await MockApiServices.deleteMockTests({ ids }, token);
      toast.update(toastId, {
        render: "Mock test(s) deleted successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      fetchMockTests();
    } catch (error) {
      toast.update(toastId, {
        render: error.message || "Failed to delete mock test(s)",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) {
      toast.warn("Please select at least one mock test to delete");
      return;
    }
    deleteMockTests(selectedIds);
  };

  const handleSingleDelete = (id) => {
    deleteMockTests([id]);
  };

  const handleEdit = (id) => {
    const test = mockData.find((t) => t._id === id);
    console.log("teasttt",test);
    navigate(RoutesPath.addMock, { state: { testData: test } });
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
              <h5 className="fw-bold mb-0">MOCK TEST</h5>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item text-dark">Dashboard</li>
                  <li
                    style={{ color: " #1544b1" }}
                    className="breadcrumb-item active"
                  >
                     Add Mock Test
                  </li>
                </ol>
              </nav>
            </div>

            <div
              className="card border-0 shadow-sm"
            >
              <div className="card-body">
                <h5 className="mb-2">Mock Test List</h5>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <button
                    className="btn btn-light text-danger"
                    style={{ backgroundColor: "#ffe6e6", border: "none" }}
                    disabled={selectedIds.length === 0}
                    onClick={handleDelete}
                  >
                    <RiDeleteBin5Line />
                  </button>

                  <InputGroup
                    style={{
                      width: "38%",
                      height: "45px",
                      backgroundColor: "#f5f8fa",
                      borderRadius: "10px",
                      marginLeft: "40%",
                    }}
                  >
                    <FormControl
                      placeholder="Search mock test name"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      style={{
                        backgroundColor: "#f5f8fa",
                        border: "none",
                        boxShadow: "none",
                      }}
                    />
                    <InputGroup.Text
                      style={{ backgroundColor: "#f5f8fa", border: "none" }}
                    >
                      <FaSearch />
                    </InputGroup.Text>
                  </InputGroup>

                  <Link
                    to={RoutesPath.addMock}
                    style={{ textDecoration: "none" }}
                  >
                    <ButtonGroup className="me-2">
                      <Button
                        style={{
                          backgroundColor: "#1544b1",
                          border: "none",
                          height: "40px",
                          fontWeight: "500",
                        }}
                      >
                        Add Mock Test
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

                <table className="table align-middle table-hover">
                  <thead >
                    <tr >
                      <th style={{ backgroundColor: "#e6f7ff" }}>
                        <input
                          type="checkbox"
                          checked={
                            selectedIds.length === mockData.length &&
                            mockData.length > 0
                          }
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                      </th>
                      <th style={{ backgroundColor: "#e6f7ff" }} className="fw-bold">Sr No.</th>
                      <th style={{ backgroundColor: "#e6f7ff" }} className="fw-bold">Mock Test Name</th>
                      <th style={{ backgroundColor: "#e6f7ff" }} className="fw-bold">Current Status</th>
                      <th style={{ backgroundColor: "#e6f7ff" }} className="fw-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-muted">
                          No mock tests found.
                        </td>
                      </tr>
                    ) : (
                      mockData.map((test, index) => (
                        <tr key={test._id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(test._id)}
                              onChange={(e) =>
                                handleCheckboxChange(test._id, e.target.checked)
                              }
                            />
                          </td>
                          <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                          <td>{test.mockTestName}</td>
                          <td>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={test.status === "active"}
                                onChange={() => confirmToggleStatus(test._id)}
                                style={{
                                  backgroundColor:
                                    test.status === "active"
                                      ? "#1544b1"
                                      : "#ccc",
                                  borderColor:
                                    test.status === "active"
                                      ? "#1544b1"
                                      : "#ccc",
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
                              onClick={() => handleEdit(test._id)}
                            >
                              <FaPen />
                            </button>
                            <button
                              className="btn btn-sm"
                              style={{
                                backgroundColor: "#ffe6e6",
                                color: "#dc3545",
                              }}
                              onClick={() => handleSingleDelete(test._id)}
                            >
                              <RiDeleteBin5Line />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                <PopupModal
                  show={showModal}
                  onHide={() => setShowModal(false)}
                  onConfirm={handleStatusChangeConfirmed}
                />
                <div className="d-flex justify-content-between align-items-center ">
                  <span className="text-muted ">
                    Showing {(currentPage - 1) * rowsPerPage + 1} to{" "} 
                    {Math.min(currentPage * rowsPerPage, totalCount)} of{" "}
                    {totalCount} enteries
                  </span>

                  <PaginationButton
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              </div>
            </div>
          </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </MainLayout>
  );
};

export default MockView;
