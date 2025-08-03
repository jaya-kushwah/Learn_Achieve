import React, { useEffect, useState } from "react";
import MainLayout from "../../Layout/MainLayout";
import { Link, useLocation } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { MdOutlineTimer } from "react-icons/md";
import RoutesPath from "../../utils/RoutesPath";
import "../../assets/Styles/UserMockTest.css";
import successImage from "../../assets/Images/success.png";
import UserMock from "../../services/UserMock";

function UserMockTest() {
  const location = useLocation();
  const { mock } = location.state || {};

  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewedIndexes, setViewedIndexes] = useState([0]);
  const [attemptedIndexes, setAttemptedIndexes] = useState([]);
  const [activeBtn, setActiveBtn] = useState("English");
  const [subjects, setSubjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        if (mock && mock._id && activeBtn) {
          const selectedSubject = mock.subjects.find(
            (sub) => sub.subject === activeBtn
          );

          if (selectedSubject) {
            const res = await UserMock.getQuestionsBySubject(
              mock._id,
              selectedSubject._id
            );
            setQuestions(res.questions || []);
            console.log(res, "hgsgsg");
          }
        }
      } catch (err) {
        console.error("Failed to fetch questions:", err.message);
      }
    };

    fetchQuestions();
  }, [activeBtn, mock]);

  const options = [
    { label: "A. 78", value: "78" },
    { label: "B. 87", value: "87" },
    { label: "C. 93", value: "93" },
    { label: "D. 42", value: "42" },
  ];

  useEffect(() => {
    if (mock?._id) {
      UserMock.getMockTestDetails(mock._id)
        .then((res) => {
          const {
            subjects = [],
            subjectQuestions = [],
            durationInMinutes = 45,
          } = res || {};
          if (mock?.subjects?.length)
            setSubjects(mock.subjects.map((sub) => sub.subject));
          // setQuestionsData(subjectQuestions);
          const defaultSubjectId =
            subjects[0]?.subjectId || subjects[0]?._id || null;
          // setActiveSubjectId(defaultSubjectId);
          setTimeLeft(durationInMinutes * 60);
        })
        .catch((err) => console.error("Error fetching mock test:", err))
        .finally(() => setLoading(false));
    }
  }, [mock]);

  useEffect(() => {
    if (mock?.duration) setTimeLeft(mock.duration * 60);
    console.log("Mock Data:", mock);
  }, [mock]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeLeft > 0) setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return { hours, minutes, remainingSeconds };
  };

  const time = formatTime(timeLeft);

  const handleClick = (index) => {
    setActiveIndex(index);
    setCurrentIndex(index);
    if (!viewedIndexes.includes(index)) {
      setViewedIndexes((prev) => [...prev, index]);
    }
  };

  const handleAttempt = (index) => {
    if (!attemptedIndexes.includes(index)) {
      setAttemptedIndexes((prev) => [...prev, index]);
    }
  };

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

  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const handleSubOptionChange = (qIdx, sIdx, selectedOpt) => {
  setAnswers((prev) => ({
    ...prev,
    [`sub-${qIdx}-${sIdx}`]: selectedOpt,
  }));
};


  return (
    <MainLayout>
      {isSubmitted ? (
        <div className="mt-5 text-center">
          <img src={successImage} alt="SUCCESS" />
          <h2 style={{ color: "green" }} className="fw-bold mb-4">
            Exam Submitted Succesfully !
          </h2>
          <Button
            as={Link}
            to={RoutesPath.userMockCard}
            style={{
              borderRadius: "12px",
              backgroundColor: "#f57c00",
              border: "none",
              padding: "9px",
              color: "white",
            }}
            className="fw-semibold px-4"
          >
            Go To Mocktest
          </Button>
        </div>
      ) : (
        <div
          className="row"
          style={{ userSelect: "none", overflowY: "hidden" }}
        >
          <div className="col-sm-7 col-md-8 col-lg-8 mt-5 left-scroll">
            <h4 className="ms-3 fw-bold mt-2">Bharat SAT Exam & Mock Test</h4>
            <div className="d-flex align-items-center ms-3 gap-4 mt-4 flex-wrap">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setActiveBtn(subject)}
                  className="btn fw-semibold px-3 py-2"
                  style={{
                    backgroundColor: activeBtn === subject ? "#f57c00" : "",
                    color: activeBtn === subject ? "#fff" : "#333",
                    border: activeBtn === subject ? "none" : "#ccc",
                    borderRadius: "8px",
                    transition: "0.2s",
                  }}
                >
                  {subject}
                </button>
              ))}
            </div>

            {Array.isArray(questions) &&
              questions.map((q, qIdx) => (
                <div key={q.questionId} className="p-3">
                  {/* Main Question Heading */}
                  <h5 className="ms-3 mt-4">Question {qIdx + 1}</h5>
                  <hr />

                  {/* Main Question Text */}
                  <p className="fw-medium text-dark ms-3">
                    {stripHtml(q.question)}
                  </p>

                  {/* Main Question Options */}
                  <Form className="ms-4">
                    {q.options?.map((opt, optIdx) => (
                      <Form.Check
                        key={optIdx}
                        type="checkbox"
                        label={stripHtml(opt)}
                        name={`question-${qIdx}`}
                        className="mb-2"
                        checked={answers[qIdx] === opt}
                        onChange={() => handleOptionChange(qIdx, opt)}
                      />
                    ))}
                  </Form>

                  {/* Sub-questions if any */}
                  {Array.isArray(q.subQuestions) &&
                    q.subQuestions.map((sub, sIdx) => (
                      <div key={sub.subQuestionId} className="ms-4 mt-3">
                        <p className="fw-bold">
                          <strong>{sIdx + 1}.</strong> {stripHtml(sub.question)}
                        </p>
                        <Form className="ms-3">
                          {sub.options?.map((opt, optIdx) => (
                            <Form.Check
                              key={optIdx}
                              type="checkbox"
                              label={stripHtml(opt)}
                              name={`subquestion-${qIdx}-${sIdx}`}
                              className="mb-2"
                              checked={answers[`sub-${qIdx}-${sIdx}`] === opt}
                              onChange={() =>
                                handleSubOptionChange(qIdx, sIdx, opt)
                              }
                            />
                          ))}
                        </Form>
                      </div>
                    ))}
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
              <button
                type="button"
                className="btn actives px-4"
                onClick={goToNext}
              >
                Next
              </button>
            </div>
          </div>

          <div className="col-sm-5 col-md-4 col-lg-4 pt-4 mt-2 text-end fw-semibold">
            <Link
              to={RoutesPath.userMockCard}
              style={{ color: "#f6821f", textDecoration: "none" }}
            >
              Back &gt;
            </Link>

            <div
              className="text-start p-3 right-side rounded-4 my-4 h-100 mt-2"
              style={{
                backgroundColor: "#e6f4ff",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className="rounded-4 p-3 text-light"
                style={{ backgroundColor: "#1a1a97" }}
              >
                <label className="fw-medium">
                  <MdOutlineTimer size={20} /> Time Left
                </label>
                <div className="d-flex time">
                  <div>
                    <div className="fs-6 fw-medium time p-3">
                      {time.hours < 10 ? `0${time.hours}` : time.hours}
                    </div>
                    <span className="p-2 fs-6">Hours</span>
                  </div>
                  <div>
                    <div className="fs-6 fw-medium time p-3">
                      {time.minutes < 10 ? `0${time.minutes}` : time.minutes}
                    </div>
                    <span className="p-2 fs-6">Minute</span>
                  </div>
                  <div>
                    <div className="fs-6 fw-medium time p-3">
                      {time.remainingSeconds < 10
                        ? `0${time.remainingSeconds}`
                        : time.remainingSeconds}
                    </div>
                    <span className="p-2 fs-6">Seconds</span>
                  </div>
                </div>
              </div>

              <div
                className="mt-3"
                style={{
                  overflowY: "auto",
                  scrollbarWidth: "none",
                  maxHeight: "calc(100vh - 270px)",
                }}
              >
                <div className="container mt-2">
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "6px",
                    }}
                  >
                    {Array.from({ length: questions.length }, (_, i) => {
                      let bgColor = "#686868";
                      let textColor = "#fff";
                      if (attemptedIndexes.includes(i)) {
                        bgColor = "#388e3c";
                      } else if (viewedIndexes.includes(i)) {
                        bgColor = "#f57c00";
                      }
                      return (
                        <div
                          key={i}
                          onClick={() => handleClick(i)}
                          className="d-flex justify-content-center align-items-center fw-semibold"
                          style={{
                            width: "60px",
                            height: "60px",
                            borderTopRightRadius: "12px",
                            borderBottomRightRadius: "12px",
                            borderBottomLeftRadius: "12px",
                            fontSize: "16px",
                            cursor: "pointer",
                            backgroundColor: bgColor,
                            color: textColor,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            transition: "all 0.2s ease-in-out",
                            margin: "0 auto",
                          }}
                        >
                          {i + 1}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <hr />
                <div className="py-2">
                  <span className="badge bg-success rounded-5">&nbsp;</span>{" "}
                  &nbsp; Answered
                </div>
                <div className="py-2">
                  <span className="badge actives rounded-5">&nbsp;</span> &nbsp;
                  Not Answered
                </div>
                <div className="py-2 pb-5">
                  <span className="badge bg-secondary rounded-5">&nbsp;</span>{" "}
                  &nbsp; Not View
                </div>

                <button
                  className="btn btn-success text-end mb-3"
                  onClick={() => setShowSubmitModal(true)}
                >
                  Submit Test
                </button>
              </div>
            </div>
            {showSubmitModal && (
              <div className="modal-overlay">
                <div
                  className="modal-content p-4 rounded"
                  style={{ background: "white", width: "400px" }}
                >
                  <button
                    className="btn text-danger fw-bold fs-4 text-end "
                    onClick={() => setShowSubmitModal(false)}
                  >
                    X
                  </button>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5>Are you sure?</h5>
                    <u
                      className="fw-semibold text-end"
                      style={{ color: "rgb(20, 72, 159)" }}
                    >
                      {`${time.hours < 10 ? "0" : ""}${time.hours} hr ${
                        time.minutes < 10 ? "0" : ""
                      }${time.minutes} mins ${
                        time.remainingSeconds < 10 ? "0" : ""
                      }${time.remainingSeconds} secs`}{" "}
                      left
                    </u>
                  </div>

                  <div
                    className="p-2 rounded mt-2 text-start"
                    style={{ backgroundColor: "#d4edda" }}
                  >
                    <span className="text-success">
                      No. of attempted questions: {attemptedIndexes.length}
                    </span>
                  </div>
                  <div
                    className="p-2 rounded mb-4  text-start mt-4"
                    style={{ backgroundColor: "#f8d7da" }}
                  >
                    <span className="text-danger">
                      Not attempted questions:{" "}
                      {questions.length - attemptedIndexes.length}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between">
                    <Button
                      variant="outline-warning"
                      className="custom-orange-btn fw-semibold px-4 ms-3 w-50"
                      onClick={() => setShowSubmitModal(false)}
                    >
                      No
                    </Button>
                    <Button
                      variant="outline-warning"
                      className="custom-orange-btn actives fw-semibold px-4 ms-3 w-50"
                      onClick={() => {
                        setIsSubmitted(true);
                        setShowSubmitModal(false);
                      }}
                    >
                      Yes
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default UserMockTest;




