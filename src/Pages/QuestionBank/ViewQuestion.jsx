import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import MainLayout from "../../Layout/MainLayout";
import { RiDeleteBin5Line } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Table,
  Form,
  Button,
  Row,
  Col,
  InputGroup,
  FormControl,
  ButtonGroup,
} from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash, FaSearch, FaPen } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import RoutesPath from "../../utils/RoutesPath";
import PaginationButton from "../../Components/resusable/PaginationButton";
import PopupModal from "../../Components/resusable/PopupModal";
import SessionManager from "../../utils/SessionManager";
import QuestionApiServices from "../../services/QuestionApiServices";
import mockTestService from "../../services/MockApiServices";

const ViewQuestion = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({
    classId: "",
    subjectId: "",
    medium: "",
  });

  const [classList, setClassList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = SessionManager.shared.getSessionToken();
        const res = await mockTestService.getAllClasses(token);
        setClassList(res.data || []);
      } catch {
        toast.error("Failed to load class options");
      }
    };
    fetchClasses();
  }, []);

  // Fetch data when filters change
  useEffect(() => {
    getData();
  }, [filters]);

  const getData = async () => {
    try {
      const token = SessionManager.shared.getSessionToken();
      const response = await QuestionApiServices.filterQuestions(
        filters,
        token
      );
      setQuestions(response.data.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch questions");
    }
  };

  const handleClassChange = async (e) => {
    const selectedClassId = e.target.value;
    setFilters({ ...filters, classId: selectedClassId, subjectId: "" });

    try {
      const token = SessionManager.shared.getSessionToken();
      const res = await mockTestService.getSubjectsByClassId(
        selectedClassId,
        token
      );

      // Support both res.data and res (array) structures
      if (Array.isArray(res?.data)) {
        setSubjectList(res.data);
      } else if (Array.isArray(res)) {
        setSubjectList(res);
      } else {
        toast.error("Unexpected subject response");
        setSubjectList([]);
      }
    } catch (err) {
      toast.error("Failed to load subjects for selected class");
      setSubjectList([]);
    }
  };

  const paginatedQuestions = questions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(questions.length / itemsPerPage);

  const confirmToggleStatus = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleStatusChangeConfirmed = async () => {
    try {
      const token = SessionManager.shared.getSessionToken();
      const current = questions.find((q) => q._id === selectedId);
      const newStatus = current.status === "active" ? "inactive" : "active";

      await QuestionApiServices.changeQuestionStatus(
        selectedId,
        newStatus,
        token
      );

      toast.success(`Status changed to ${newStatus}`);
      setQuestions((prev) =>
        prev.map((q) =>
          q._id === selectedId ? { ...q, status: newStatus } : q
        )
      );
      setShowModal(false);
      setSelectedId(null);
    } catch (err) {
      toast.error(err?.message || "Status update failed");
      setShowModal(false);
      setSelectedId(null);
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      toast.warning("Select at least one question to delete.");
      return;
    }
    const token = SessionManager.shared.getSessionToken();
    const toastId = toast.loading("Deleting...");
    try {
      await QuestionApiServices.deleteQuestion({ ids: selectedIds }, token);
      toast.update(toastId, {
        render: "Questions deleted successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setQuestions((prev) => prev.filter((q) => !selectedIds.includes(q._id)));
      setSelectedIds([]);
      setSelectAll(false);
    } catch (err) {
      toast.update(toastId, {
        render: err?.message || "Delete failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleSingleDelete = async (id) => {
    const token = SessionManager.shared.getSessionToken();
    const toastId = toast.loading("Deleting...");
    try {
      await QuestionApiServices.deleteQuestion({ id }, token);
      toast.update(toastId, {
        render: "Deleted successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      toast.update(toastId, {
        render: err?.message || "Failed to delete",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      const ids = paginatedQuestions.map((q) => q._id);
      setSelectedIds(ids);
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const handleEdit = (id) => {
    const selectedQuestion = questions.find((q) => q._id === id); 
    console.log("selectedQuestion Dataa is : ",selectedQuestion);
    navigate(RoutesPath.addQuestion, {
      state: { step: 1, editData: selectedQuestion },
    });
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
          <h5 className="fw-bold mb-0">QUESTION BANK</h5>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item text-dark">Dashboard</li>
              <li
                style={{ color: " #1544b1" }}
                className="breadcrumb-item active"
              >
              Questions Bank
              </li>
            </ol>
          </nav>
        </div>

            <div
              className="bg-white rounded shadow-sm p-4"
            >
              <h5 className="mb-3"> Question Bank List</h5>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  className="btn btn-light text-danger"
                  style={{
                    backgroundColor: "#ffe6e6",
                    border: "none",
                    width: "35px",
                    height: "38px",
                  }}
                  disabled={selectedIds.length === 0}
                  onClick={handleDelete}
                >
                  <RiDeleteBin5Line style={{ marginLeft: "-20%" }} />
                </button>

                <InputGroup
                  style={{
                    width: "38%",
                    height: "45px",
                    backgroundColor: "#f5f8fa",
                    borderRadius: "10px",
                    marginLeft: "19%",
                    border: "none",
                    boxShadow: "none",
                    overflow: "hidden",
                  }}
                >
                  <FormControl
                    placeholder="Search"
                    className="fw-bold"
                    onChange={(e) => {
                      setCurrentPage(1);
                    }}
                    style={{
                      backgroundColor: "#f5f8fa",
                      border: "none",
                      boxShadow: "none",
                      height: "45px",
                      paddingLeft: "12px",
                      outline: "none",
                    }}
                  />
                  <InputGroup.Text
                    style={{
                      backgroundColor: "#f5f8fa",
                      border: "none",
                      cursor: "pointer",
                      outline: "none",
                      boxShadow: "none",
                    }}
                  >
                    <FaSearch />
                  </InputGroup.Text>
                </InputGroup>

                {/* Add and Bulk Upload */}
                <Link
                  to={RoutesPath.addQuestion}
                  style={{ textDecoration: "none" }}
                >
                  <ButtonGroup>
                    <Button
                      style={{
                        backgroundColor: "#1544b1",
                        border: "none",
                        height: "40px",
                        fontWeight: "500",
                      }}
                    >
                      Add Question Bank
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

                <Link
                  to={RoutesPath.addQuestion}
                  style={{ textDecoration: "none" }}
                >
                  <ButtonGroup>
                    <Button
                      style={{
                        backgroundColor: "#1544b1",
                        border: "none",
                        height: "40px",
                        fontWeight: "500",
                      }}
                    >
                      Bulk Upload
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

              <Row className="mt-3 mb-3">
                <Col md={4}>
                  <Form.Select
                    className="custom-input"
                    value={filters.classId}
                    onChange={handleClassChange}
                  >
                    <option value="">Filter By Class</option>
                    {classList.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.class}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <Form.Select
                    className="custom-input"
                    value={filters.subjectId}
                    onChange={(e) =>
                      setFilters({ ...filters, subjectId: e.target.value })
                    }
                  >
                    <option value="">Filter By Subject</option>
                    {subjectList.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.subject}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <Form.Select
                    className="custom-input"
                    value={filters.medium}
                    onChange={(e) =>
                      setFilters({ ...filters, medium: e.target.value })
                    }
                  >
                    <option value="">Filter By Medium</option>
                    <option value="English">Hindi</option>
                    <option value="English">English</option>
                    <option value="English">Semi English</option>
                    <option value="Semi English">Marathi</option>
                  </Form.Select>
                </Col>
              </Row>

              <div
                style={{
                  overflowX: "auto",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
                className="hide-scrollbar"
              >
                <Table
                  className="table align-middle no-hover"
                  style={{
                    minWidth: "1200px",
                    borderCollapse: "collapse",
                    border: "1px solid #dee2e6",
                  }}
                >
                  <thead>
                    <tr>
                      {[
                        "",
                        "Sr No.",
                        "Class",
                        "Medium",
                        "Subject",
                        "Question Bank/SAT Exam",
                        "Question Type",
                        "Question",
                        "Status",
                        "Action",
                        "Status",
                      ].map((head, i) => (
                        <th
                          key={i}
                          style={{
                            padding: "20px 12px",
                            whiteSpace: "nowrap",
                            backgroundColor: "#e6f4ff",
                          }}
                        >
                          {head === "" ? (
                            <Form.Check
                              className="no-hover-checkbox"
                              type="checkbox"
                              checked={
                                paginatedQuestions.length > 0 &&
                                selectedIds.length === paginatedQuestions.length
                              }
                              onChange={handleSelectAll}
                            />
                          ) : (
                            head
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedQuestions.map((q, index) => (
                      <tr
                        className="fw-semibold"
                        style={{ fontSize: "15px", color: "#343a40" }}
                        key={q.id}
                      >
                        <td style={{ padding: "20px 12px" }}>
                          <Form.Check
                            type="checkbox"
                            className="no-hover-checkbox"
                            checked={selectedIds.includes(q._id)}
                            onChange={() => handleCheckboxChange(q._id)}
                          />
                        </td>
                        <td style={{ padding: "20px 12px" }}>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td style={{ padding: "20px 12px" }}>
                          {q.classId?.class}
                        </td>
                        <td style={{ padding: "20px 12px" }}>{q.medium}</td>
                        <td style={{ padding: "20px 12px" }}>
                          {q.subjectId?.subject}
                        </td>
                        <td style={{ padding: "20px 12px" }}>
                          {q.questionType}
                        </td>
                        <td style={{ padding: "20px 12px" }}>
                          {q.typeOfQuestion}
                        </td>
                        <td style={{ padding: "20px 12px" }}>
                          {q.questionText
                            ? stripHtml(q.questionText)
                            : "No questionText found"}
                        </td>

                        <td style={{ padding: "20px 12px" }}>
                          <Form.Check
                            type="switch"
                            checked={q.status === "active"}
                            onChange={() => confirmToggleStatus(q._id)}
                            className="custom-switch"
                          />
                        </td>

                        <td
                          style={{ padding: "20px 12px", whiteSpace: "nowrap" }}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <button
                              className="btn btn-sm"
                              style={{
                                backgroundColor: "#e6fff0",
                                color: "#28a745",
                              }}
                              onClick={() => handleEdit(q._id)}
                            >
                              <FaPen />
                            </button>

                            <button
                              className="btn btn-sm"
                              style={{
                                backgroundColor: "#ffe6e6",
                                color: "#dc3545",
                              }}
                              onClick={() => handleSingleDelete(q._id)}
                            >
                              <RiDeleteBin5Line />
                            </button>
                          </div>
                        </td>

                        <td style={{ padding: "20px 18px" }}>
                          <span
                            onClick={() => handleToggles(q._id)}
                            style={{
                              fontWeight: 600,
                              color: q.status === "active" ? "green" : "red",
                              cursor: "pointer",
                            }}
                          >
                            {q.status === "active" ? "Approved" : "Rejected"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <PopupModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onConfirm={handleStatusChangeConfirmed}
              />

              {/* Pagination */}
              <div style={{ marginLeft: "70%" }}>
                {totalPages > 0 && (
                  <PaginationButton
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                )}
              </div>
            </div>

            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar
            />
          </div>
    </MainLayout>
  );
};

export default ViewQuestion;
