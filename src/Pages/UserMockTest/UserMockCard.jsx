import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import MainLayout from "../../Layout/MainLayout";
import { Link, Links, useNavigate } from "react-router-dom";
import RoutesPath from "../../utils/RoutesPath";
import MockApiServices from "../../services/MockApiServices";
import SessionManager from "../../utils/SessionManager";

const UserMockCard = () => {
  const navigate = useNavigate();
  const [mockTests, setMockTests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = SessionManager.shared.getSessionToken();
        const result = await MockApiServices.getPaginatedMockTests(
          "",
          10,
          0,
          token
        );
        setMockTests(result.mockTests);
        console.log("Mock Tests: ", result.mockTests);
      } catch (err) {
        console.error("Mock test fetch error:", err.message);
      }
    };

    fetchData();
  }, []);

  // const handleClick = () => {
  //   navigate(RoutesPath.userMockTest);
  // };
const handleClick = (mock) => {
  navigate(RoutesPath.userMockTest, { state: { mock } });
};


  return (
    <MainLayout>
      <div style={{ marginTop: "6%" }}>
        <h5 className="fw-bold mb-3 ms-4">My Mock Test</h5>
        {mockTests.map((mock, index) => (
          <div
            key={mock._id || index}
            className="p-3 rounded mb-3"
            style={{ backgroundColor: "#e6f4ff" }}
          >
            <Row className="align-items-center">
              <Col md={12}>
                <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                  <span style={{ color: "#14489f" }} className="fw-bold">
                    CLASS {mock.class[0]?.class} MOCK TEST -{" "}
                    {mock.subjects?.map((s) => s.name).join(", ")}
                  </span>
                  <span
                    className="fw-bold"
                    style={{ fontFamily: "cursive", color: "#dc3545" }}
                  >
                    {mock.status === "active" ? "Active" : "Expired"}
                  </span>

                  <div style={{ fontSize: "13px" }}>
                    <span style={{ fontStyle: "italic" }}>Note:&nbsp;</span>
                    <span className="fw-bold">
                      Mock tests are prepared based on complete syllabus and
                      will be available for attempt accordingly for your maximum
                      benefit.
                    </span>
                  </div>
                </div>

                <hr />

                <div
                  className="d-flex justify-content-between align-items-start"
                  style={{ fontSize: "13px" }}
                >
                  <div className="text-muted d-flex flex-wrap gap-4">
                    <div>
                      <span style={{ color: "#8d8d8d" }}>Subjects:&nbsp;</span>
                      <span className="fw-bold">
                        {mock.subjects?.map((s) => s.subject).join(", ")}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "#8d8d8d" }}>Time:&nbsp;</span>{" "}
                      <span className="fw-bold"> {mock.duration} mins</span>
                    </div>
                    <div>
                      <span style={{ color: "#8d8d8d" }}>
                        No of Attempts:&nbsp;
                      </span>{" "}
                      <span className="fw-bold"> {mock.attempts || 0}</span>
                    </div>
                  </div>
                  <div>
                    {/* <Button
                      style={{ borderRadius: "20px" }}
                      variant="outline-warning"
                      className="custom-orange-btn fw-semibold px-4"
                      onClick={handleClick}
                    >
                      View Results
                    </Button> */}

                    <Button
                      style={{ borderRadius: "12px" }}
                      variant="outline-warning"
                      className="custom-orange-btn fw-semibold px-4 ms-3"
                      // onClick={handleClick}
                      onClick={() => handleClick(mock)}
                    >
                      Start
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center">
        <Button
          as={Link}
          to={RoutesPath.addMock}
          style={{
            borderRadius: "12px",
            backgroundColor: "#f57c00",
            padding: "9px",
            color: "white",
          }}
          variant="outline"
          className="fw-semibold px-4"
        >
          Buy Mock Tests
        </Button>
      </div>
    </MainLayout>
  );
};

export default UserMockCard;
