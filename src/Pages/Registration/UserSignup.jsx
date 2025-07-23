import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { FaUser, FaPhone, FaKey, FaCalendarAlt, FaCheck } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import MainLayout from "../../Layout/MainLayout";
import ReusableInput from "../../Components/resusable/ReusableInput";
import userService from "../../services/UserServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../../Components/resusable/CustomLoader";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registrationSchema } from "../../utils/utils"; 

const StepIndicator = ({ currentStep, onStepClick }) => {
  const steps = [
    { number: 1, label: "Personal Details", icon: FaUser },
    { number: 2, label: "Contact Details", icon: FaPhoneAlt },
    { number: 3, label: "OTP Verification", icon: FaKey },
  ];

  return (
    <div className="mb-5 px-2">
      <Row className="align-items-center justify-content-center">
        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;

          // ✅ Allow click only if NOT at step 3
          const isClickable =
            isCompleted && currentStep !== 3;

          return (
            <React.Fragment key={step.number}>
              {/* Line between steps */}
              {index !== 0 && (
                <div
                  style={{
                    height: 2,
                    width: 330,
                    backgroundColor:
                      isActive || isCompleted ? "#f57c00" : "#ccc",
                  }}
                />
              )}

              {/* Step Circle */}
              <div
                onClick={() => {
                  if (isClickable) onStepClick(step.number);
                }}
                className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold"
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor:
                    isActive || isCompleted ? "#f57c00" : "#ccc",
                  cursor: isClickable ? "pointer" : "default",
                  transition: "background-color 0.3s ease",
                }}
              >
                {isCompleted ? <FaCheck /> : <step.icon />}
              </div>
            </React.Fragment>
          );
        })}
      </Row>

      {/* Labels */}
      <Row className="text-center mt-2 justify-content-center">
        {steps.map((step) => (
          <div
            key={step.number}
            className="text-center"
            style={{ width: "320px"   , marginLeft: "35px", }}
          >
            <h6>{step.label}</h6>
          </div>
        ))}
      </Row>
      <hr style={{ border: "1.2px solid grey" }} />
    </div>
  );
};


const UserSignup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const OTP_LENGTH = 6;
  const TIMER_SECONDS = 60;
  const navigate = useNavigate();

  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const [personalDetails, setPersonalDetails] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "",
    medium: "",
    class: "",
    schoolName: "",
    registerBy: "",
    uniqueCode: "",
    // password: "student@123", // Default or generated
  });
  const [contactDetails, setContactDetails] = useState({
    email: "",
    mobile: "",
    addressLine1: "",
    addressLine2: "",
    state: "",
    district: "",
    taluka: "",
    pinCode: "",
  });
  const [studentId, setStudentId] = useState(null);

  const email = contactDetails?.email;
  const mobile = contactDetails?.mobile;
  const maskedMobile = mobile ? `XXXXXXX${mobile.slice(-4)}` : "";

useEffect(() => {
  let interval;

  if (currentStep === 3 && timer > 0) {
    interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
  }

  if (timer === 0) {
    setResendEnabled(true);
  }

  return () => clearInterval(interval);
}, [currentStep, timer]);


  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value[0];
    setOtp(newOtp);

    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("Text")
      .slice(0, OTP_LENGTH)
      .replace(/\D/g, "");
    const newOtp = [...otp];
    for (let i = 0; i < pasteData.length; i++) {
      newOtp[i] = pasteData[i];
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = pasteData[i];
      }
    }
    setOtp(newOtp);
    const lastIndex = pasteData.length - 1;
    if (inputRefs.current[lastIndex]) inputRefs.current[lastIndex].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResend = () => {
    setTimer(TIMER_SECONDS);
    setOtp(new Array(OTP_LENGTH).fill(""));
    inputRefs.current[0].focus();
    setResendEnabled(false);
  };

  const formatTime = () => {
    const mins = String(Math.floor(timer / 60)).padStart(2, "0");
    const secs = String(timer % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      try {
        setLoading(true);
        const payload = { ...personalDetails };

        if (payload.registerBy !== "Coordinator") {
          delete payload.uniqueCode;
        }

        const res = await userService.addPersonalDetails(payload);
        console.log("Personal details submitted:", res.pendingStudent._id);
        setStudentId(res.pendingStudent._id);

        setCurrentStep(2);
      } catch (err) {
        console.error("Personal detail submit error:", err);
        toast.error("Failed to submit personal details.");
      } finally {
        setLoading(false);
      }
    } else if (currentStep === 2) {
      setLoading(true);
      try {
        const contactDetailsPayload = {
          pendingStudentId: studentId,
          email: contactDetails.email,
          mobile: contactDetails.mobile,
          addressLine1: contactDetails.addressLine1,
          addressLine2: contactDetails.addressLine2,
          state: contactDetails.state,
          district: contactDetails.district,
          taluka: contactDetails.taluka,
          pinCode: contactDetails.pinCode,
        };

        const res = await userService.addContactDetails(contactDetailsPayload);
        toast.success("OTP sent to your email");
        console.log("Contact details submitted:", res);

        setCurrentStep(3);
      } catch (err) {
        console.error("Contact detail submit error:", err);
        alert("Failed to submit contact details.");
      } finally {
        setLoading(false);
      }
    } else if (currentStep === 3) {
      setLoading(true);
      try {
        const enteredOtp = otp.join("");
        if (enteredOtp.length !== OTP_LENGTH) {
          toast.error("Please enter a valid 6-digit OTP.");
          return;
        }

        const payload = {
          pendingStudentId: studentId,
          otp: enteredOtp,
        };

        const response = await userService.verifyOtpAndRegister(payload);
        console.log("OTP verified successfully:", response);

        toast.success("Registration completed successfully!");
        setTimeout(() => {
          setCurrentStep(1);
          window.location.reload();
        }, 3000);
      } catch (error) {
        console.error("OTP verification failed:", error);
        toast.error(error?.message || "Failed to verify OTP.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStepClick = (stepNum) => {
    setCurrentStep(stepNum);
  };

  return (
    <MainLayout>
      <Container style={{ marginTop: "6%" }}>
        <StepIndicator
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        <Form style={{ marginTop: "-2%" }}>
          {currentStep === 1 && (
            <>
              <h5 className="fw-semibold mb-4">Personal Details</h5>

              <Row className="mb-3">
                <Col md={4}>
                  <ReusableInput
                    id="firstName"
                    label="First Name"
                    placeholder="Enter your first name"
                    value={personalDetails.firstName}
                    onChange={(e) =>
                      setPersonalDetails({
                        ...personalDetails,
                        firstName: e.target.value,
                      })
                    }
                  />
                </Col>
                <Col md={4}>
                  <ReusableInput
                    id="middleName"
                    label="Middle Name"
                    placeholder="Enter your middle name"
                    value={personalDetails.middleName}
                    onChange={(e) =>
                      setPersonalDetails({
                        ...personalDetails,
                        middleName: e.target.value,
                      })
                    }
                  />
                </Col>
                <Col md={4}>
                  <ReusableInput
                    id="lastName"
                    label="Last Name"
                    placeholder="Enter your last name"
                    value={personalDetails.lastName}
                    onChange={(e) =>
                      setPersonalDetails({
                        ...personalDetails,
                        lastName: e.target.value,
                      })
                    }
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}>
                  <ReusableInput
                    id="dob"
                    type="date"
                    label="Date of Birth"
                    placeholder="Enter your date of birth"
                    value={personalDetails.dob}
                    onChange={(e) =>
                      setPersonalDetails({
                        ...personalDetails,
                        dob: e.target.value,
                      })
                    }
                  />
                </Col>
                <Col md={4}>
                  <ReusableInput
                    id="gender"
                    label="Gender"
                    type="select"
                    placeholder="Select Gender"
                    value={personalDetails.gender}
                    options={["Male", "Female", "Other"]}
                    onChange={(e) =>
                      setPersonalDetails({
                        ...personalDetails,
                        gender: e.target.value,
                      })
                    }
                  />
                </Col>
                <Col md={4}>
                  <ReusableInput
                    id="schoolName"
                    label="School Name"
                    placeholder="Enter your school name"
                    value={personalDetails.schoolName}
                    onChange={(e) =>
                      setPersonalDetails({
                        ...personalDetails,
                        schoolName: e.target.value,
                      })
                    }
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}>
                  <ReusableInput
                    id="medium"
                    label="Medium"
                    type="select"
                    placeholder="Select Medium"
                    value={personalDetails.medium}
                    options={["Hindi", "English", "Marathi"]}
                    onChange={(e) =>
                      setPersonalDetails({
                        ...personalDetails,
                        medium: e.target.value,
                      })
                    }
                  />
                </Col>
                <Col md={4}>
                  <ReusableInput
                    id="class"
                    label="Class"
                    type="select"
                    placeholder="Select Class"
                    value={personalDetails.class}
                    options={["1st", "2nd", "3rd"]}
                    onChange={(e) =>
                      setPersonalDetails({
                        ...personalDetails,
                        class: e.target.value,
                      })
                    }
                  />
                </Col>

                <Col md={4}>
                  <ReusableInput
                    id="registerBy"
                    type="select"
                    label="Register By"
                    placeholder="Register By"
                    value={personalDetails.registerBy}
                    onChange={(e) =>
                      setPersonalDetails({
                        ...personalDetails,
                        registerBy: e.target.value,
                      })
                    }
                    options={["Student", "Coordinator"]}
                  />
                </Col>

                {personalDetails.registerBy === "Coordinator" && (
                  <Col md={4} className="mt-3">
                    <ReusableInput
                      id="uniqueCode"
                      label="Unique Code"
                      placeholder="Enter your unique code"
                      value={personalDetails.uniqueCode}
                      onChange={(e) =>
                        setPersonalDetails({
                          ...personalDetails,
                          uniqueCode: e.target.value,
                        })
                      }
                      required
                    />
                  </Col>
                )}
              </Row>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h5 className="fw-semibold mb-4">Contact Details</h5>

              <Row className="mb-3">
                <Col md={4}>
                  <ReusableInput
                    id="email"
                    label="Email"
                    placeholder="Enter your email id"
                    value={contactDetails.email}
                    onChange={(e) =>
                      setContactDetails({
                        ...contactDetails,
                        email: e.target.value,
                      })
                    }
                  />
                </Col>
                <Col md={4}>
                  <ReusableInput
                    id="mobile"
                    label="Mobile"
                    placeholder="Enter your mobile no."
                    value={contactDetails.mobile}
                    onChange={(e) =>
                      setContactDetails({
                        ...contactDetails,
                        mobile: e.target.value,
                      })
                    }
                  />
                </Col>
                <Col md={4}>
                  <ReusableInput
                    id="address-1"
                    label="Address Line-1"
                    placeholder="Enter your address"
                    value={contactDetails.addressLine1}
                    onChange={(e) =>
                      setContactDetails({
                        ...contactDetails,
                        addressLine1: e.target.value,
                      })
                    }
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}>
                  <ReusableInput
                    id="address-2"
                    label="Address Line-2"
                    placeholder="Enter your address"
                    value={contactDetails.addressLine2}
                    onChange={(e) =>
                      setContactDetails({
                        ...contactDetails,
                        addressLine2: e.target.value,
                      })
                    }
                  />
                </Col>
                <Col md={4}>
                  <ReusableInput
                    id="state"
                    type="select"
                    label="State"
                    placeholder="Select State"
                    value={contactDetails.state}
                    onChange={(e) =>
                      setContactDetails({
                        ...contactDetails,
                        state: e.target.value,
                      })
                    }
                    options={[
                      "Andaman and Nicobar Islands",
                      "Andhra Pradesh",
                      "Arunachal Pradesh",
                      "Assam",
                      "Bihar",
                      "Chandigarh",
                      "Chhattisgarh",
                      "Dadra and Nagar Haveli",
                      "Daman and Diu",
                      "Delhi",
                      "Goa",
                      "Gujarat",
                      "Haryana",
                      "Himachal Pradesh",
                      "Jammu and Kashmir",
                      "Jharkhand",
                      "Karnataka",
                      "Kerala",
                      "Ladakh",
                      "Lakshadweep",
                      "Madhya Pradesh",
                      "Maharashtra",
                      "Manipur",
                      "Meghalaya",
                      "Mizoram",
                      "Nagaland",
                      "Odisha",
                      "Puducherry",
                      "Punjab",
                      "Rajasthan",
                      "Sikkim",
                      "Tamil Nadu",
                      "Telangana",
                      "Tripura",
                      "Uttar Pradesh",
                      "Uttarakhand",
                      "West Bengal",
                    ]}
                  />
                </Col>

                {(contactDetails.state === "" ||
                  contactDetails.state === "Madhya Pradesh") && (
                  <Col md={4}>
                    <ReusableInput
                      id="district"
                      type="select"
                      label="District"
                      placeholder="Select District"
                      value={contactDetails.district}
                      onChange={(e) =>
                        setContactDetails({
                          ...contactDetails,
                          district: e.target.value,
                        })
                      }
                      options={["Khargone", "Indore"]}
                    />
                  </Col>
                )}
              </Row>

              {(contactDetails.state === "" ||
                contactDetails.state === "Madhya Pradesh") && (
                <Row className="mb-3">
                  <Col md={4}>
                    <ReusableInput
                      id="taluka"
                      type="select"
                      label="Taluka"
                      placeholder="Select Taluka"
                      value={contactDetails.taluka}
                      onChange={(e) =>
                        setContactDetails({
                          ...contactDetails,
                          taluka: e.target.value,
                        })
                      }
                      options={["Nimad", "Malwa"]}
                    />
                  </Col>
                  <Col md={4}>
                    <ReusableInput
                      id="pinCode"
                      type="select"
                      label="Pin Code"
                      placeholder="Select Pin Code"
                      value={contactDetails.pinCode}
                      onChange={(e) =>
                        setContactDetails({
                          ...contactDetails,
                          pinCode: e.target.value,
                        })
                      }
                      options={["452005", "452002"]}
                    />
                  </Col>
                </Row>
              )}
            </>
          )}

          {currentStep === 3 && (
            <>
              <h5 className="fw-bold">OTP Verification</h5>

              <p className="mb-4">
                A One-Time Password has been sent to {maskedMobile}
                {email ? ` and to ${email}` : ""}
              </p>

              <Row className="mb-3">
                <label className="fw-bold">OTP</label>
                <Col>
                  <div className="d-flex gap-2 mt-3" onPaste={handlePaste}>
                    {otp.map((digit, index) => (
                      <Form.Control
                        key={index}
                        type="text"
                        maxLength={1}
                        value={digit}
                        className="text-center custom-input"
                        style={{
                          width: "45px",
                          height: "45px",
                          fontSize: "20px",
                        }}
                        ref={(el) => (inputRefs.current[index] = el)}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                      />
                    ))}
                  </div>
                </Col>
              </Row>

              <div className="d-flex align-items-center gap-3 mt-2">
                <span className="fw-bold" style={{ minWidth: "50px" }}>
                  {formatTime()}
                </span>
                <Button
                  variant="link"
                  className="p-0"
                  style={{
                    color: "#f7a77b",
                    textDecoration: "none",
                    marginLeft: "15%",
                  }}
                  disabled={!resendEnabled}
                  onClick={handleResend}
                >
                  Resend OTP
                </Button>
              </div>
            </>
          )}

          <div className="text-end">
            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                disabled={loading}
                style={{
                  backgroundColor: "#f57c00",
                  border: "none",
                  padding: "10px 30px",
                  borderRadius: "25px",
                  fontWeight: "bold",
                }}
              >
                {loading ? (
                  <CustomLoader height={30} width={30} color="#fff" />
                ) : currentStep < 3 ? (
                  "Next"
                ) : (
                  "Submit"
                )}
              </Button>
            ) : null}
          </div>
        </Form>
      </Container>
    </MainLayout>
  );
};

export default UserSignup;
