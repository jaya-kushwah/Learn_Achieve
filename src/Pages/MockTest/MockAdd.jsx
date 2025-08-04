import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import MainLayout from "../../Layout/MainLayout";
import mockTestService from "../../services/MockApiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import SessionManager from "../../utils/SessionManager";
import RoutesPath from "../../utils/RoutesPath";
import CustomLoader from "../../Components/resusable/CustomLoader";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { mockTestValidationSchema } from "../../utils/utils";
import FormValidationMessage from "../../utils/MockValid";
import { RiDeleteBin5Line } from "react-icons/ri";

const MockAdd = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const testData = location.state?.testData || null;
  const [classOptions, setClassOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(mockTestValidationSchema),
    defaultValues: {
      mockTestName: "",
      medium: "",
      class: "",
      duration: "",
      status: "active",
      subjects: [{ subject: "", questions: "" }],
      // totalQuestions:"",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subjects",
  });

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

  useEffect(() => {
    const setFormValuesWithTestData = async () => {
      if (testData) {
        const token = SessionManager.shared.getSessionToken();
        const classId =
          typeof testData.class?.[0] === "object"
            ? testData.class[0]._id
            : testData.class[0];

        setValue("mockTestName", testData.mockTestName || "");
        setValue("medium", testData.medium?.[0] || "");
        setValue("duration", testData.duration || "");
        setValue("status", testData.status || "active");

        try {
          const res = await mockTestService.getSubjectsByClassId(
            classId,
            token
          );
          setSubjectOptions(res || []);

          const prefill = (testData.subjects || []).map((s) => ({
            subject: typeof s === "object" ? s._id : s,
            questions: testData.totalQuestions || "",
          }));

          setValue(
            "subjects",
            prefill.length ? prefill : [{ subject: "", questions: "" }]
          );

          // ✅ Set class after subject options and classOptions are available
          setValue("class", classId);
        } catch {
          toast.error("Failed to load subjects");
        }
      }
    };

    if (testData && classOptions.length > 0) {
      setFormValuesWithTestData();
    }
  }, [testData, classOptions, setValue]);

  const handleClassChange = async (e) => {
    const selectedClass = e.target.value;
    setValue("class", selectedClass);
    if (selectedClass) {
      try {
        const token = SessionManager.shared.getSessionToken();
        const res = await mockTestService.getSubjectsByClassId(
          selectedClass,
          token
        );
        setSubjectOptions(res || []);
        setValue("subjects", [{ subject: "", questions: "" }]);
      } catch {
        toast.error("Failed to load subjects");
      }
    } else {
      setSubjectOptions([]);
      setValue("subjects", [{ subject: "", questions: "" }]);
    }
  };

  const onSubmit = async (data) => {
    console.log("Submitting form with data:", data);
    try {
      const totalQuestions = data.subjects.reduce(
        (acc, curr) => acc + parseInt(curr.questions || 0),
        0
      );

      const payload = {
        mockTestName: data.mockTestName,
        medium: [data.medium],
        class: [data.class],
        subjects: data.subjects.map((item) => String(item.subject)),
        duration: parseInt(data.duration),
        totalQuestions,
        status: data.status,
      };

      setLoading(true);
      const token = SessionManager.shared.getSessionToken();
      const response = await mockTestService.createMockTest(
        payload,
        testData?._id || null,
        token
      );
      console.log("Payload:", payload);
      console.log("ID for update:", testData?._id);

      toast.success(response.message || "Mock Test Saved");
      navigate(RoutesPath.viewMock);
    } catch (err) {
      toast.error(err.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div
        className="p-4 text-truncate"                 
        style={{
          marginTop: "3%",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold mb-0">MOCK TEST</h5>
          <nav aria-label="breadcrumb ">
            <ol className="breadcrumb mb-0 ">
              <li className="breadcrumb-item text-dark ">Dashboard</li>
              <li
                className="breadcrumb-item active"
                style={{ color: "#1544b1" }}
              >
                {testData ? "Edit Mock Test" : "Add Mock Test"}
              </li>
            </ol>
          </nav>
        </div>

        <div className="bg-white rounded shadow-sm p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h4 className="mb-4 fw-bold">
              {testData ? "Edit Mock Test" : "Create Mock Test"}
            </h4>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">
                  Mock Test Name <span className="text-danger fw-bold">*</span>
                </label>
                <input
                  type="text"
                  className="form-control custom-input"
                  {...register("mockTestName")}
                  placeholder="Enter Mock Test Name"
                />
                <FormValidationMessage message={errors.mockTestName?.message} />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Select Medium <span className="text-danger fw-bold">*</span>
                </label>
                <select
                  className="form-select custom-select"
                  {...register("medium")}
                >
                  <option value="">Select</option>
                  <option>Hindi</option>
                  <option>English</option>
                  <option>Semi-English</option>
                  <option>Marathi</option>
                </select>
                <FormValidationMessage message={errors.medium?.message} />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Select Class <span className="text-danger fw-bold">*</span>
                </label>
                <select
                  className="form-select custom-select"
                  {...register("class")}
                  onChange={handleClassChange}
                >
                  <option value="">Select</option>
                  {classOptions.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.class}
                    </option>
                  ))}
                </select>
                <FormValidationMessage message={errors.class?.message} />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Duration in Mins{" "}
                  <span className="text-danger fw-bold">*</span>
                </label>
                <input
                  type="number"
                  className="form-control custom-input"
                  placeholder="Enter duration"
                  {...register("duration")}
                />
                <FormValidationMessage message={errors.duration?.message} />
              </div>
            </div>

            <div
              className="p-4 mt-4 rounded"
              style={{ backgroundColor: "#e6f4ff" }}
            >
              {fields.map((item, index) => (
                <div className="row g-3 align-items-end mb-3" key={item.id}>
                  <div className="col-md-6">
                    <label
                      className="form-label"
                      style={{ color: "#1544b1", fontWeight: 500 }}
                    >
                      Select Subject{" "}
                      <span className="text-danger fw-bold">*</span>
                    </label>
                    <select
                      className="form-select custom-select"
                      {...register(`subjects.${index}.subject`)}
                    >
                      <option value="">Select</option>
                      {subjectOptions.map((subj) => (
                        <option key={subj._id} value={subj._id}>
                          {subj.subject}
                        </option>
                      ))}
                    </select>
                    <FormValidationMessage
                      message={errors.subjects?.[index]?.subject?.message}
                    />
                  </div>

                  <div className="col-md-6">
                    <label
                      className="form-label"
                      style={{ color: "#1544b1", fontWeight: 500 }}
                    >
                      Total No. of Questions{" "}
                      <span className="text-danger fw-bold">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control custom-input"
                      {...register(`subjects.${index}.questions`)}
                      placeholder="Enter number of questions"
                    />
                    <FormValidationMessage
                      message={errors.subjects?.[index]?.questions?.message}
                    />
                  </div>

                  {/* Remove Button below only last field */}
                  {index === fields.length - 1 && fields.length > 1 && (
                    <div className="col-12 d-flex justify-content-end mt-2">
                      <button
                        type="button"
                        // className="btn btn-danger btn-sm "
                        style={{ border: "none", backgroundColor:"#e6f4ff"}}
                        onClick={() => remove(index)}
                      >
                        <RiDeleteBin5Line color="red" size={20}/>
                      </button>
                    </div>
                  )}
                </div>
              ))}

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm px-1 py-0"
                  style={{ backgroundColor: "#e6f4ff", color: "blue" }}
                  onClick={() => append({ subject: "", questions: "" })}
                >
                  +
                </button>
                <button
                  type="button"
                  className="btn btn-sm"
                  style={{
                    color: "#1544b1",
                    fontWeight: "500",
                    backgroundColor: "#e6f4ff",
                    border: "none",
                  }}
                  onClick={() => append({ subject: "", questions: "" })}
                >
                  Add More
                </button>
              </div>
            </div>

            <div className="mt-4 text-end">
              <button
                type="submit"
                className="btn px-4"
                style={{ backgroundColor: "#1544b1", color: "white" }}
                disabled={loading}
              >
                {loading ? (
                  <CustomLoader height={30} width={30} color="#fff" />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </MainLayout>
  );
};

export default MockAdd;
