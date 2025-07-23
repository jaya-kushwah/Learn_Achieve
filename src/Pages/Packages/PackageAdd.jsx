import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import MainLayout from "../../Layout/MainLayout";
import { Form, Button, Row, Col, Card } from "react-bootstrap";

const PackageAdd = () => {
  const [formData, setFormData] = useState({
    packageName: "",
    selectedClass: "",
    medium: "",
    image: null,
  });

  const [mockTests, setMockTests] = useState([{ test: "", attempts: "" }]);

  const handleAddMockTest = () => {
    setMockTests([...mockTests, { test: "", attempts: "" }]);
  };

  const handleMockTestChange = (index, field, value) => {
    const updated = [...mockTests];
    updated[index][field] = value;
    setMockTests(updated);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form Submitted!");
    console.log("Form Data:", formData);
    console.log("Mock Tests:", mockTests);
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

        <div className="bg-white rounded shadow-sm p-4">
          <form onSubmit={handleSubmit}>
            <h4 className="mb-4 fw-bold">Add Packages</h4>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="custom-label">
                    Package Name <span className="text-danger fw-bold">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="packageName"
                    placeholder="Package Name"
                    className="custom-input"
                    required
                    value={formData.packageName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="custom-label mt-3">
                    Select Class <span className="text-danger fw-bold">*</span>
                  </Form.Label>
                  <Form.Select
                    name="selectedClass"
                    className="custom-select text-muted"
                    required
                    value={formData.selectedClass}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="custom-label mt-3">
                    Select Medium <span className="text-danger fw-bold">*</span>
                  </Form.Label>
                  <Form.Select
                    name="medium"
                    className="custom-select text-muted"
                    required
                    value={formData.medium}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="custom-label ">
                    Image <span className="text-danger fw-bold">*</span>{" "}
                    <small className="text-danger">
                      ( Extension : jpg . jpeg . webp ) Note : Dimesnsion Size
                      1000 x 600 px
                    </small>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    className="custom-input"
                    accept=".jpg,.jpeg,.webp"
                    required
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {mockTests.map((item, index) => (
              <Card
                key={index}
                className="mb-3 shadow-sm border-0"
                style={{ backgroundColor: "#e6f4ff" }}
              >
                <Card.Body>
                  <Row className="align-items-end">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label
                          className="custom-label "
                          style={{ color: "#1544b1", fontWeight: 500 }}
                        >
                          Select Mock Test
                        </Form.Label>
                        <Form.Select
                          className="custom-select text-muted"
                          value={item.test}
                          onChange={(e) =>
                            handleMockTestChange(index, "test", e.target.value)
                          }
                        >
                          <option value="">Select</option>
                          <option value="bharat">Bharat Sat Exam</option>
                          <option value="pradnya">Pradnya Learnitics</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label
                          className="custom-label"
                          style={{ color: "#1544b1", fontWeight: 500 }}
                        >
                          No. of Attempts
                        </Form.Label>
                        <Form.Control
                          type="number"
                          className="custom-input"
                          placeholder="No. of Attempts"
                          value={item.attempts}
                          onChange={(e) =>
                            handleMockTestChange(
                              index,
                              "attempts",
                              e.target.value
                            )
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex align-items-center gap-2 mt-4">
                    <button
                      className="btn btn-outline-primary btn-sm px-1 py-0"
                      type="button"
                      onClick={handleAddMockTest}
                    >
                      +
                    </button>
                    <span style={{ color: "#1544b1", fontWeight: 500 }}>
                      Add More
                    </span>
                  </div>
                </Card.Body>
              </Card>
            ))}

            <Row className="mt-4">
              <Col md={12}>
                <div
                  className="d-flex align-items-center px-3 py-2 rounded"
                  style={{ backgroundColor: "#e6f4ff" }}
                >
                  <Form.Check type="checkbox" className="me-2" id="bharatSat" />
                  <Form.Label
                    htmlFor="bharatSat"
                    className="mb-0"
                    style={{ cursor: "pointer" }}
                  >
                    Bharat Sat Exam
                  </Form.Label>
                </div>
              </Col>
              <Col className="mt-4" md={12}>
                <div
                  className="d-flex align-items-center px-3 py-2 rounded"
                  style={{ backgroundColor: "#e6f4ff" }}
                >
                  <Form.Check type="checkbox" className="me-2" id="pradnya" />
                  <Form.Label
                    htmlFor="pradnya"
                    className="mb-0"
                    style={{ cursor: "pointer" }}
                  >
                    Pradnya Learnitics
                  </Form.Label>
                </div>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="custom-label">
                    Actual Price inclusive of GST{" "}
                    <span className="text-danger fw-bold">*</span>
                  </Form.Label>
                  <Form.Control
                    className="custom-input"
                    placeholder="Actual Price"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="custom-label">
                    Discounted Price inclusive of GST
                  </Form.Label>
                  <Form.Control
                    className="custom-input"
                    placeholder="Discounted Price"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="custom-label mt-3">
                    Price After Coordinator Discount
                  </Form.Label>
                  <Form.Control
                    className="custom-input"
                    placeholder="Discount"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="custom-label mt-3">
                    Validity in Days (Number){" "}
                    <span className="text-danger fw-bold">*</span>
                  </Form.Label>
                  <Form.Control
                    className="custom-input"
                    placeholder="Validity in Days"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-4 text-end">
              <Button
                type="submit"
                className="px-4"
                style={{ backgroundColor: "#1544b1", color: "white" }}
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default PackageAdd;
