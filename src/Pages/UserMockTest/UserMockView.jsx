import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Nav } from "react-bootstrap";
import MainLayout from "../../Layout/MainLayout";
import "../../assets/Styles/UserMockView.css";
import {
  FaPenAlt,
  FaCheck,
  FaTimes,
  FaClipboardList,
  FaClock,
  FaHourglassStart,
  FaHourglassEnd,
} from "react-icons/fa";
import { Button, Form } from "react-bootstrap";

const StatCard = ({ label, value, bgColor, icon }) => (
  <Col xs={12} sm={6} md={3} className="mb-3">
    <div className=" d-flex align-items-center p-2">
      <div className="icon-circle ms-2" style={{ backgroundColor: bgColor }}>
        {icon}
      </div>
      <div>
        <div className="stat-value-text">{value}</div>
        <div className="stat-label-text">{label}</div>
      </div>
    </div>
  </Col>
);

const TimeCard = ({ label, value, bgColor, icon }) => (
  <Col xs={12} sm={6} md={3} className="mb-3 ">
    <div className=" d-flex align-items-center p-2 gap-2">
      <div className="icon-circle ms-2" style={{ backgroundColor: bgColor }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "15px", color: "gray" }}>hh : mm : ss</div>
        <div style={{ fontWeight: "bold", fontSize: "16px" }}>{value}</div>
        <div style={{ color: "#777", fontSize: "14px" }}>{label}</div>
      </div>
    </div>
  </Col>
);

const UserMockView = () => {
  const [activeBtn, setActiveBtn] = useState("English");
  const subjects = ["English", "Geography", "Mathematics"];
  const [answers, setAnswers] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);

  const questions = [
    "Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry.",
    "Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry.",
  ];

  const options = [
    { label: "A. 78", value: "78" },
    { label: "B. 87", value: "87" },
    { label: "C. 93", value: "93" },
    { label: "D. 42", value: "42" },
  ];

  const handleOptionChange = (qIdx, value) => {
    setAnswers({ ...answers, [qIdx]: value });
    handleAttempt(qIdx);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prev = currentIndex - 1;
      setCurrentIndex(prev);
      setActiveIndex(prev);
      if (!viewedIndexes.includes(prev)) {
        setViewedIndexes((prevList) => [...prevList, prev]);
      }
    }
  };

  const goToNext = () => {
    if (currentIndex < questions.length - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      setActiveIndex(next);
      if (!viewedIndexes.includes(next)) {
        setViewedIndexes((prevList) => [...prevList, next]);
      }
    }
  };

  return (
    <MainLayout>
      <div className="py-4 mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold">CLASS 12th MOCK TEST-ENGLISH</h5>
          <div className="back-text">Back &gt;</div>
        </div>

        <Card className="p-3 shadow-sm mb-4 ">
          <h6 className="fw-bold">My Overall Performance Summary</h6>
          <Row className="mt-2">
            <StatCard
              label="Marks"
              value="0/14"
              bgColor="#4CAF50"
              icon={<FaClipboardList size={20} color="#fff" />}
            />
            <StatCard
              label="Attempted"
              value="0/7"
              bgColor="#FFC107"
              icon={<FaPenAlt size={20} color="#fff" />}
            />
            <StatCard
              label="Correct"
              value="0/7"
              bgColor="#E91E63"
              icon={<FaCheck size={20} color="#fff" />}
            />
            <StatCard
              label="Incorrect"
              value="0/7"
              bgColor="#FF5722"
              icon={<FaTimes size={20} color="#fff" />}
            />
          </Row>

          <h6 className="fw-bold mt-2">Total Time Taken</h6>
          <Row className="mt-2">
            <TimeCard
              label="Start Time"
              value="10:58:04 PM"
              bgColor="#2c71da"
              icon={<FaHourglassStart size={18} color="#fff" />}
            />
            <TimeCard
              label="End Time"
              value="12:21:41 AM"
              bgColor="#a479ff"
              icon={<FaHourglassEnd size={18} color="#fff" />}
            />
            <TimeCard
              label="Time Taken"
              value="01:23:00"
              bgColor="#14b9d1"
              icon={<FaClock size={18} color="#fff" />}
            />
          </Row>
        </Card>

        <div className="d-flex align-items-center gap-1 mt-3 flex-wrap">
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setActiveBtn(subject)}
              className="btn fw-semibold px-3 py-2"
              style={{
                backgroundColor: activeBtn === subject ? "#f57c00" : "",
                color: activeBtn === subject ? "#fff" : "#333",
                border: activeBtn === subject ? "none" : " #ccc",
                borderRadius: "8px",
                transition: "0.2s",
              }}
            >
              {subject}
            </button>
          ))}
        </div>

        <Card className="p-3 shadow-sm mt-3">
          <h6 className="fw-bold">Subject Performance Summary</h6>
          <Row className="mt-2">
            <StatCard
              label="Marks"
              value="0/14"
              bgColor="#4CAF50"
              icon={<FaClipboardList size={20} color="#fff" />}
            />
            <StatCard
              label="Attempted"
              value="0/7"
              bgColor="#FFC107"
              icon={<FaPenAlt size={20} color="#fff" />}
            />
            <StatCard
              label="Correct"
              value="0/7"
              bgColor="#E91E63"
              icon={<FaCheck size={20} color="#fff" />}
            />
            <StatCard
              label="Incorrect"
              value="0/7"
              bgColor="#FF5722"
              icon={<FaTimes size={20} color="#fff" />}
            />
          </Row>
        </Card>

        {questions.map((q, qIdx) => (
          <div key={qIdx} className="p-3">
            <span className="fontes">Question {qIdx + 1} </span>
            <p className="fontes text-dark mt-2">
              {/* <strong>{qIdx + 1}. </strong> */}
              {q}
            </p>
            <p style={{marginTop:"-4%"}} className="text-end fontes text-danger">Not Answered</p>
            <Form className="ms-3 fontes">
              {options.map((opt, optIdx) => (
                <Form.Check
                  key={optIdx}
                  type="checkbox"
                  label={opt.label}
                  name={`question-${qIdx}`}
                  className="mb-2"
                  checked={answers[qIdx] === opt.value}
                  onChange={() => handleOptionChange(qIdx, opt.value)}
                />
              ))}
            </Form>
          </div>
        ))}

        <hr></hr>
        <div className="d-flex justify-content-between align-items-center">
          <button
            className="btn actives"
            disabled={currentIndex === 0}
            onClick={goToPrevious}
          >
            Previous
          </button>
          <button type="button" className="btn actives px-4" onClick={goToNext}>
            Next
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserMockView;
