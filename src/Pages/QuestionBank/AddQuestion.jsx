import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import MainLayout from "../../Layout/MainLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  ButtonGroup,
} from "react-bootstrap";
import { FaPlus, FaCheck, FaChevronRight } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { questionValidationSchema } from "../../utils/utils";
import questionApiServices from "../../services/QuestionApiServices";
import mockTestService from "../../services/MockApiServices";
import SessionManager from "../../utils/SessionManager";
import { Link, useLocation } from "react-router-dom";
import CustomQuillEditor from "../../Components/resusable/CustomQuillEditor";
import successImage from "../../assets/Images/Done.png";
import RoutesPath from "../../utils/RoutesPath";
import { FaPen } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import FormValidationMessage from "../../utils/MockValid";

const StepIndicator = ({ currentStep, onStepClick }) => (
  <div className="d-flex align-items-center justify-content-start mb-4">
    {[1, 2, 3].map((stepNum, index) => (
      <React.Fragment key={stepNum}>
        {index !== 0 && (
          <div
            className={`step-line ${currentStep >= stepNum ? "active" : ""}`}
          />
        )}
        <div
          className="rounded-circle fw-bold d-flex justify-content-center align-items-center text-white"
          onClick={() => {
            if (stepNum < currentStep) onStepClick(stepNum);
          }}
          style={{
            minWidth: 40,
            minHeight: 40,
            width: "9vw",
            height: "9vw",
            maxWidth: 50,
            maxHeight: 50,
            backgroundColor: currentStep >= stepNum ? "#1544b1" : "#adb5bd",
            cursor: stepNum < currentStep ? "pointer" : "not-allowed",
            opacity: stepNum > currentStep ? 0.6 : 1,
            transition: "background-color 0.5s ease",
            fontSize: "1rem",
            flexShrink: 0,
          }}
        >
          {currentStep >= stepNum ? <FaCheck /> : `0${stepNum}`}
        </div>
      </React.Fragment>
    ))}
  </div>
);

const AddQuestion = () => {
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [classOptions, setClassOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [parentQuestion, setParentQuestion] = useState("");
  const [parentId, setParentId] = useState(null);
  const [subQuestion, setSubQuestion] = useState("");
  const [selectedTypeOfQuestion, setSelectedTypeOfQuestion] = useState("");
  const [subQuestions, setSubQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([
    { label: "A", value: "" },
    { label: "B", value: "" },
    { label: "C", value: "" },
    { label: "D", value: "" },
  ]);
  const [correctOption, setCorrectOption] = useState(""); // e.g., "A"
  const [solution, setSolution] = useState("");
  const [editingSubId, setEditingSubId] = useState(null);

  // console.log("subQuestions", subQuestions);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(questionValidationSchema),
  });

  useEffect(() => {
    if (location?.state?.step === 1) {
      setStep(1);
    }
  }, [location]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = SessionManager.shared.getSessionToken();
        const res = await mockTestService.getAllClasses(token);
        setClassOptions(res.data || []);
      } catch {
        toast.error("Failed to load class options");
      }
    };
    fetchClasses();
  }, []);

  const handleClassChange = async (e) => {
    const classId = e.target.value;
    setValue("class", classId, { shouldValidate: true });

    try {
      const token = SessionManager.shared.getSessionToken();
      const res = await mockTestService.getSubjectsByClassId(classId, token);
      const subjects = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];
      setSubjectOptions(subjects);
    } catch {
      toast.error("Failed to load subjects");
      setSubjectOptions([]);
    }
  };

  const onSubmit = async (formData) => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!parentQuestion.trim()) {
        toast.error("Question is required");
        return;
      }

      const token = SessionManager.shared.getSessionToken();

      // Payload me id add karo agar parentId available ho (update ke liye)
      const payload = {
        id: parentId || undefined,
        classId: formData.class,
        subjectId: formData.subject,
        medium: formData.medium,
        module: formData.module,
        topicName: formData.topicName,
        typeOfQuestion: formData.typeOfQuestion,
        questionType: formData.questionType,
        questionText: parentQuestion,
      };

      if (formData.typeOfQuestion === "General") {
        const optionValues = options.map((opt) => opt.value.trim());

        if (optionValues.some((opt) => !opt)) {
          toast.error("All options must be filled");
          return;
        }

        if (!correctOption) {
          toast.error("Correct option is required");
          return;
        }

        payload.options = optionValues;
        payload.correctAnswer = correctOption;
        payload.solution = solution;
      }

      try {
        const res = await questionApiServices.createOrUpdateQuestion(
          payload,
          token
        );
        toast.success(
          parentId
            ? "Question updated successfully!"
            : "Question created successfully!"
        );

        // Agar naya create hua to id set karo parentId me for further updates
        const qId = res.data?.data?._id;
        if (!parentId) setParentId(qId);

        if (formData.typeOfQuestion === "General") {
          setStep(3);
        } else {
          setStep(2.5);
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || "Something went wrong!");
      }
    }

    if (step === 2.5) {
      setStep(3);
    }
  };

  const handleSubQuestionSubmit = async () => {
    const optionsArray = options.map((opt) => opt.value.trim());

    if (!subQuestion || !optionsArray || !correctOption || !parentId) {
      toast.error("All subquestion fields are required");
      return;
    }

    if (optionsArray.some((opt) => !opt)) {
      toast.error("All options must be filled");
      return;
    }

    if (!["A", "B", "C", "D"].includes(correctOption)) {
      toast.error("Correct option must be A, B, C, or D");
      return;
    }

    const correctAnswer = options.find(
      (opt) => opt.label === correctOption
    )?.value;

    if (!correctAnswer) {
      toast.error("Correct option must match an actual option value");
      return;
    }

    try {
      const token = SessionManager.shared.getSessionToken();
      const payload = {
        parentId,
        questionText: subQuestion,
        options: optionsArray,
        correctAnswer: correctAnswer,
        // solution,
      };
      await questionApiServices.addSubQuestion(payload, token);

      toast.success("Subquestion added successfully!");
      setSubQuestion("");
      setOptions([
        { label: "A", value: "" },
        { label: "B", value: "" },
        { label: "C", value: "" },
        { label: "D", value: "" },
      ]);
      setCorrectOption("");
      setSolution("");
      fetchSubQuestions(parentId);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add subquestion");
    }
  };

  const fetchSubQuestions = async (parentId) => {
    try {
      setLoading(true);
      const token = SessionManager.shared.getSessionToken();

      const response = await questionApiServices.getSubQuestions(
        parentId,
        token
      );
      console.log(" Subquestions fetched:", response.data);

      // setSubQuestions(response.data?.data || []);
      setSubQuestions(response.data?.subQuestions || []);
    } catch (err) {
      console.error(" Subquestion fetch error:", err);
      toast.error(
        err?.response?.data?.message || "Failed to fetch subquestions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (parentId) {
      fetchSubQuestions(parentId);
    }
  }, [parentId]);

  useEffect(() => {
    const data = location?.state?.editData;
    if (data) {
      console.log(
        data,
        "hejkhfejdfcahdgcdgbvhegbfhewgfuefhewkhfwkjhfcjsbchsdavhcd"
      );

      const classId = data.classId?._id || data.classId;
      const token = SessionManager.shared.getSessionToken();

      mockTestService
        .getSubjectsByClassId(classId, token)
        .then((res) => {
          const subjects = Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res)
            ? res
            : [];
          setSubjectOptions(subjects);

          setValue("class", classId);

          // Subject ko tabhi set karo jab wo options me ho
          if (subjects.some((subj) => subj._id === data.subjectId)) {
            setValue("subject", data.subjectId);
          } else {
            setValue("subject", "");
          }

          // Baaki form fields set karo
          setValue("medium", data.medium);
          setValue("module", data.module);
          setValue("topicName", data.topicName);
          setValue("typeOfQuestion", data.typeOfQuestion);
          setValue("questionType", data.questionType);

          setSelectedTypeOfQuestion(data.typeOfQuestion);
          setParentQuestion(data.questionText);
          setParentId(data._id);

          // Agar type General hai to options, correctAnswer, solution bhi set karo
          if (data.typeOfQuestion === "General") {
            const prefillOptions = data.options?.map((val, index) => ({
              label: String.fromCharCode(65 + index),
              value: val,
            })) || [
              { label: "A", value: "" },
              { label: "B", value: "" },
              { label: "C", value: "" },
              { label: "D", value: "" },
            ];
            setOptions(prefillOptions);
            // If backend gives label like 'A', convert to value
            const selectedOption = prefillOptions.find(
              (opt) => opt.label === data.correctAnswer
            );
            setCorrectOption(selectedOption?.label || "");
            setSolution(data.solution || "");
          }
        })
        .catch((error) => {
          console.error("Error fetching subjects:", error);
          setSubjectOptions([]);
        });
    }
  }, [location, setValue]);

  useEffect(() => {
    const fetchSubjectsIfEditing = async () => {
      const data = location?.state?.editData;
      if (data?.classId) {
        const token = SessionManager.shared.getSessionToken();
        const res = await mockTestService.getSubjectsByClassId(
          data.classId?._id || data.classId,
          token
        );

        setSubjectOptions(res || []);
      }
    };

    fetchSubjectsIfEditing();
  }, [location]);

  const handleSubDelete = async (id) => {
    try {
      console.log(id);
      const token = SessionManager.shared.getSessionToken();
      await questionApiServices.deleteSubQuestion(id, token);
      toast.success("Subquestion deleted successfully");
      fetchSubQuestions(parentId);
    } catch (error) {
      toast.error("Failed to delete subquestion: " + error.message);
    }
  };

  //   const handleSubEdit = async (id) => {
  //   try {
  //     const token = SessionManager.shared.getSessionToken();
  //     // const res = await questionApiServices.getSingleSubQuestion(id, token);

  //     // const data = res.data?.data || {};

  //     // Set fields for editing
  //     setSubQuestion(data.questionText || "");

  //     const formattedOptions = data.options?.map((opt, i) => ({
  //       label: String.fromCharCode(65 + i), // A, B, C, D
  //       value: opt,
  //     })) || [
  //       { label: "A", value: "" },
  //       { label: "B", value: "" },
  //       { label: "C", value: "" },
  //       { label: "D", value: "" },
  //     ];
  //     setOptions(formattedOptions);

  //     const correctLabel = formattedOptions.find(
  //       (opt) => opt.value === data.correctAnswer
  //     )?.label;

  //     setCorrectOption(correctLabel || "");

  //     setSolution(data.solution || "");

  //     // Optional: Track which subquestion is being edited
  //     setEditingSubId(id);
  //   } catch (error) {
  //     toast.error("Failed to load subquestion for editing");
  //     console.error(error);
  //   }
  // };

  const handleSubEdit = async (id) => {
    try {
      // Find subquestion from already fetched list
      const sub = subQuestions.find((item) => item._id === id);
      if (!sub) {
        toast.error("Subquestion not found");
        return;
      }

      // Set fields for editing
      setSubQuestion(sub.questionText || "");

      const formattedOptions = sub.options?.map((opt, i) => ({
        label: String.fromCharCode(65 + i), // A, B, C, D
        value: opt,
      })) || [
        { label: "A", value: "" },
        { label: "B", value: "" },
        { label: "C", value: "" },
        { label: "D", value: "" },
      ];
      setOptions(formattedOptions);

      const correctLabel = formattedOptions.find(
        (opt) => opt.value === sub.correctAnswer
      )?.label;

      setCorrectOption(correctLabel || "");
      setSolution(sub.solution || "");

      setEditingSubId(id);
    } catch (error) {
      toast.error("Something went wrong while editing");
      console.error(error);
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

        <div className="bg-white rounded shadow-sm p-4">
          <h5 className="mb-4">Question Bank List</h5>

          <StepIndicator currentStep={step} onStepClick={setStep} />

          <Card className="border-0">
            <Form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1 */}
              {step === 1 && (
                <>
                  {/* Class and Subject */}
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          Select Class <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          {...register("class")}
                          onChange={handleClassChange}
                          className={`custom-input ${
                            errors.class ? "is-invalid" : ""
                          }`}
                        >
                          <option value="">Select</option>
                          {classOptions.map((cls) => (
                            <option key={cls._id} value={cls._id}>
                              {cls.class}
                            </option>
                          ))}
                        </Form.Select>
                        <FormValidationMessage
                          message={errors.class?.message}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          Select Subject <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          {...register("subject")}
                          className={`custom-input ${
                            errors.subject ? "is-invalid" : ""
                          }`}
                        >
                          <option value="">Select</option>
                          {subjectOptions.map((subj) => (
                            <option key={subj._id} value={subj._id}>
                              {subj.subject}
                            </option>
                          ))}
                        </Form.Select>

                        <FormValidationMessage
                          message={errors.subject?.message}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          Select Medium <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          {...register("medium")}
                          className={`custom-input ${
                            errors.medium ? "is-invalid" : ""
                          }`}
                        >
                          <option value="">Select</option>
                          <option>Hindi</option>
                          <option>English</option>
                          <option>Semi-English</option>
                          <option>Marathi</option>
                        </Form.Select>
                        <FormValidationMessage
                          message={errors.medium?.message}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          Type of Question{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          {...register("typeOfQuestion")}
                          onChange={(e) => {
                            const value = e.target.value;
                            setValue("typeOfQuestion", value, {
                              shouldValidate: true,
                            });
                            setSelectedTypeOfQuestion(value);
                          }}
                          className={`custom-input ${
                            errors.typeOfQuestion ? "is-invalid" : ""
                          }`}
                        >
                          <option value="General">General</option>
                          <option value="Comprehensive">Comprehensive</option>
                          <option value="Poem">Poem</option>
                        </Form.Select>
                            <FormValidationMessage
                          message={errors.typeOfQuestion?.message}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          Module<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          {...register("module")}
                          className={`custom-input ${
                            errors.module ? "is-invalid" : ""
                          }`}
                        >
                          <option value="">Select</option>
                          <option>Module 1</option>
                          <option>Module 2</option>
                        </Form.Select>
                        {errors.module && (
                          <div className="text-danger mt-1">
                            {errors.module.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          Topic Name<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          {...register("topicName")}
                          className={`custom-input ${
                            errors.topicName ? "is-invalid" : ""
                          }`}
                        >
                          <option value="">Select</option>
                          <option>Topic 1</option>
                          <option>Topic 2</option>
                        </Form.Select>
                        {errors.topicName && (
                          <div className="text-danger mt-1">
                            {errors.topicName.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          Question Type
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          {...register("questionType")}
                          className={`custom-input ${
                            errors.questionType ? "is-invalid" : ""
                          }`}
                        >
                          {/* <option value="">Select</option> */}
                          <option>Question Bank</option>
                          <option>SAT Exam</option>
                        </Form.Select>
                        {errors.questionType && (
                          <div className="text-danger mt-1">
                            {errors.questionType.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>
                        {selectedTypeOfQuestion === "Comprehensive" ||
                        selectedTypeOfQuestion === "Poem"
                          ? "Parent Question"
                          : ""}{" "}
                        {/* <span className="text-danger">*</span> */}
                      </Form.Label>
                      {selectedTypeOfQuestion === "Comprehensive" ||
                      selectedTypeOfQuestion === "Poem" ? (
                        <CustomQuillEditor
                          value={parentQuestion}
                          onChange={setParentQuestion}
                        />
                      ) : (
                        <>
                          {/* Question Text */}
                          <label>
                            <strong>Question*</strong>
                          </label>
                          <CustomQuillEditor
                            value={parentQuestion}
                            onChange={setParentQuestion}
                          />
                          <br />
                          {/* Options A to D */}
                          {options.map((opt, index) => (
                            <div key={opt.label}>
                              <label>
                                <strong>Option {opt.label}*</strong>
                              </label>
                              <CustomQuillEditor
                                value={opt.value}
                                onChange={(content) => {
                                  const updated = [...options];
                                  updated[index].value = content;
                                  setOptions(updated);
                                }}
                              />
                              <br />
                            </div>
                          ))}

                          <div
                            style={{
                              backgroundColor: "#eaf4ff",
                              padding: "20px",
                              borderRadius: "10px",
                              borderLeft: "5px solid #0033a0",
                              marginBottom: "20px",
                            }}
                          >
                            <label
                              style={{
                                display: "block",
                                marginBottom: "8px",
                                fontWeight: "600",
                              }}
                            >
                              Correct Option
                              <span style={{ color: "red" }}> *</span>
                            </label>
                            <select
                              className="form-select"
                              value={correctOption}
                              onChange={(e) => setCorrectOption(e.target.value)}
                              style={{
                                borderRadius: "10px",
                                height: "45px",
                                fontSize: "16px",
                                padding: "10px",
                                backgroundColor: "#fff",
                                boxShadow: "0 0 5px rgba(0,0,0,0.05)",
                              }}
                            >
                              <option value="">Select Correct Option</option>
                              {options.map((opt) => (
                                <option key={opt.label} value={opt.label}>
                                  Option {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          {/* Solution */}
                          <label>
                            <strong>Solution</strong>
                          </label>
                          <CustomQuillEditor
                            value={solution}
                            onChange={setSolution}
                          />
                        </>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              )}

              {step === 2.5 && (
                <Row>
                  {["Comprehensive", "Poem"].includes(selectedTypeOfQuestion) &&
                    parentId && (
                      <div
                        style={{
                          backgroundColor: "#f0f6ff",
                          padding: "15px 20px",
                          borderRadius: "10px",
                          position: "relative",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "20px",
                        }}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: parentQuestion,
                          }}
                          style={{
                            fontWeight: "600",
                            fontSize: "16px",
                            color: "#0033a0",
                            flex: 1,
                          }}
                        ></div>

                        {/* Edit Button */}
                        <button
                          onClick={() => setStep(2)}
                          style={{
                            backgroundColor: "#0033a0",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            width: "36px",
                            height: "36px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginLeft: "15px",
                            cursor: "pointer",
                          }}
                          title="Edit"
                        >
                          <FaPen />
                        </button>
                      </div>
                    )}

                  {/* Left side: Sub-question entry */}
                  <Col md={6}>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSubQuestionSubmit();
                      }}
                    >
                      <div
                        className={`editor-wrapper ${
                          step >= 3 ? "compact-editor" : ""
                        }`}
                      >
                        <label>
                          <strong>Question*</strong>
                        </label>
                        <CustomQuillEditor
                          value={subQuestion}
                          onChange={setSubQuestion}
                        />
                      </div>

                      <br />

                      {options.map((opt, index) => (
                        <div key={opt.label}>
                          <div
                            className={`editor-wrapper ${
                              step >= 3 ? "compact-editor" : ""
                            }`}
                          >
                            <label>
                              <strong>Option {opt.label}*</strong>
                            </label>
                            <CustomQuillEditor
                              value={opt.value}
                              onChange={(content) => {
                                const updated = [...options];
                                updated[index].value = content;
                                setOptions(updated);
                              }}
                            />
                          </div>
                          <br />
                        </div>
                      ))}

                      <div
                        style={{
                          backgroundColor: "#eaf4ff",
                          padding: "20px",
                          borderRadius: "10px",
                          borderLeft: "5px solid #0033a0",
                          marginBottom: "20px",
                        }}
                      >
                        <label
                          style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "600",
                          }}
                        >
                          Correct Option
                          <span style={{ color: "red" }}> *</span>
                        </label>
                        <select
                          className="form-select"
                          value={correctOption}
                          onChange={(e) => setCorrectOption(e.target.value)}
                          style={{
                            borderRadius: "10px",
                            height: "45px",
                            fontSize: "16px",
                            padding: "10px",
                            backgroundColor: "#fff",
                            boxShadow: "0 0 5px rgba(0,0,0,0.05)",
                          }}
                        >
                          <option value="">Select Correct Option</option>
                          {options.map((opt) => (
                            <option key={opt.label} value={opt.label}>
                              Option {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div
                        className={`editor-wrapper ${
                          step >= 3 ? "compact-editor" : ""
                        }`}
                      >
                        <label>
                          <strong>Solution</strong>
                        </label>
                        <CustomQuillEditor
                          value={solution}
                          onChange={setSolution}
                        />
                      </div>

                      <ButtonGroup
                        className="mt-4"
                        style={{ marginLeft: "60%" }}
                      >
                        <Button
                          type="button"
                          variant="success"
                          onClick={handleSubQuestionSubmit}
                          style={{
                            backgroundColor: "#1544b1",
                            border: "none",
                            height: "40px",
                            fontWeight: "500",
                          }}
                        >
                          Add Subquestion
                        </Button>
                        <Button
                          type="button"
                          variant="success"
                          onClick={handleSubQuestionSubmit}
                          style={{
                            backgroundColor: "#1665d8",
                            border: "none",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FaChevronRight />
                        </Button>
                      </ButtonGroup>
                    </Form>
                  </Col>

                  <Col
                    md={6}
                    style={{
                      backgroundColor: "#f3f3f3",
                      padding: "20px",
                      minHeight: "100%",
                      borderRadius: "10px",
                      textAlign: "center",
                      color: "gray",
                      fontWeight: "500",
                    }}
                  >
                    {subQuestions.length === 0 ? (
                      <div>No Questions Found</div>
                    ) : (
                      subQuestions.map((q, index) => (
                        <div
                          key={q._id || index}
                          style={{
                            backgroundColor: "white",
                            borderRadius: "10px",
                            padding: "15px",
                            marginBottom: "15px",
                            boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <h6 className="mb-0 d-flex align-items-center me-2">
                            {index + 1}.{" "}
                            <span
                              className="ms-3 mt-3"
                              dangerouslySetInnerHTML={{
                                __html: q.questionText || "No question text",
                              }}
                            ></span>
                          </h6>

                          {(q.options || []).map((opt, i) => (
                            <div key={i}>
                              <div
                                style={{
                                  backgroundColor:
                                    opt === q.correctAnswer
                                      ? "#008000"
                                      : "#f3f3f3",
                                  color:
                                    opt === q.correctAnswer ? "white" : "black",
                                  padding: "10px",
                                  borderRadius: "5px",
                                  marginBottom: "10px",
                                  display: "flex",
                                  alignItems: "center",
                                  height: "38px",
                                }}
                              >
                                <p className="me-3 mt-3">
                                  {String.fromCharCode(65 + i)}.
                                </p>
                                <span
                                  className="mt-3"
                                  dangerouslySetInnerHTML={{
                                    __html: opt,
                                  }}
                                ></span>
                              </div>
                            </div>
                          ))}

                          <span
                            className="btn btn-sm "
                            style={{
                              color: "#28a745",
                              border: "none",
                              marginLeft: "74%",
                            }}
                            onClick={() => handleSubEdit(q._id)}
                          >
                            <FaPen />
                          </span>

                          <span
                            className="btn btn-sm"
                            style={{
                              color: "#dc3545",
                              border: "none",
                            }}
                            onClick={() => handleSubDelete(q._id)}
                          >
                            <RiDeleteBin5Line />
                          </span>
                        </div>
                      ))
                    )}
                  </Col>
                </Row>
              )}

              {/* Step 3 - Success */}
              {step === 3 && (
                <Row className="mb-3">
                  <img
                    style={{ width: "40%", marginLeft: "28%" }}
                    src={successImage}
                    alt="SUCCESS"
                  />
                </Row>
              )}

              {/* Footer Navigation */}
              <div className="d-flex justify-content-between align-items-center mt-4 fw-bold">
                {step > 1 ? (
                  <span
                    onClick={() => setStep(step - 1)}
                    style={{ color: "#1544b1", cursor: "pointer" }}
                  >
                    &lt; Back
                  </span>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <ButtonGroup>
                    <Button
                      type="submit"
                      style={{
                        backgroundColor: "#1544b1",
                        border: "none",
                        height: "40px",
                        fontWeight: "500",
                      }}
                    >
                      Next Step
                    </Button>
                    <Button
                      type="submit"
                      style={{
                        backgroundColor: "#1665d8",
                        border: "none",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <FaChevronRight />
                    </Button>
                  </ButtonGroup>
                ) : (
                  <Link
                    to={RoutesPath.addQuestion}
                    state={{ step: 1 }}
                    style={{ textDecoration: "none" }}
                    onClick={() => window.location.reload()}
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
                        Add More Question
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
                )}
              </div>
            </Form>
          </Card>
        </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </MainLayout>
  );
};

export default AddQuestion;
