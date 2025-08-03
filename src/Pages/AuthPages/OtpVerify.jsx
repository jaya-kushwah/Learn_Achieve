import React, { useState, useRef, useEffect, useContext } from "react";
import { Row, Col, Form, Button, Card } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../../Layout/AuthLayout";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/Images/logo.png";
import { toast } from "react-toastify";
import AuthApiServices from "../../services/AuthApiServices";
import SessionManager from "../../utils/SessionManager";
import RoutesPath from "../../utils/RoutesPath";
import CustomLoader from "../../Components/resusable/CustomLoader";

const OtpVerify = () => {
  const otpLength = 6;
  const [otp, setOtp] = useState(Array(otpLength).fill(""));
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(60);
  const {  otpToken = "" } = location.state || {};

  const { setisAuthenticated, setUser } = useContext(AuthContext);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    console.log("Location state:", location.state);
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== "" && index < otpLength - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, otpLength);
    if (/^\d+$/.test(pasted)) {
      const newOtp = pasted.split("");
      setOtp([...newOtp, ...Array(otpLength - newOtp.length).fill("")]);
      newOtp.forEach((digit, idx) => {
        if (inputsRef.current[idx]) {
          inputsRef.current[idx].value = digit;
        }
      });
      inputsRef.current[pasted.length - 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

//   const handleVerifyClick = async () => {
//   if (otp.includes("")) {
//     return toast.error("Please enter all 6 digits of the OTP!");
//   }

//   const enteredOtp = otp.join("");
//   const token = otpToken; 

//   try {
//     setLoading(true);
    
//     const res = await AuthApiServices.verifyLoginOtp({ otp: enteredOtp }, token);
//     SessionManager.shared.setSessionToken(res.token);
//     const adminData = await AuthApiServices.getAdminDetails();
//     SessionManager.shared.storeUserData(adminData);
//     setisAuthenticated(true);
//     setUser(adminData);

//     toast.success("OTP Verified!");
//     navigate(RoutesPath.viewMock, { state: { email } });
//   } catch (error) {
//     toast.error(error?.response?.data?.message || "OTP verification failed!");
//   } finally {
//     setLoading(false);
//   }
// };

const handleVerifyClick = async () => {
  if (otp.includes("")) {
    return toast.error("Please enter all 6 digits of the OTP!");
  }

  const enteredOtp = otp.join("");

  try {
    setLoading(true);

    if (otpToken) {
      // 🔐 Login OTP flow
      const res = await AuthApiServices.verifyLoginOtp({ otp: enteredOtp }, otpToken);
      SessionManager.shared.setSessionToken(res.token);

      const adminData = await AuthApiServices.getAdminDetails();
      SessionManager.shared.storeUserData(adminData);
      setisAuthenticated(true);
      setUser(adminData);

      toast.success("OTP Verified!");
      navigate(RoutesPath.viewMock, { state: { email } });
    } else {
      // 🔐 Password Reset OTP flow
      const res = await AuthApiServices.verifyResetOtp({ email, otp: enteredOtp });

      toast.success("OTP Verified for Reset!");
      navigate(RoutesPath.resetPassword, { state: { email } });
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "OTP verification failed!");
  } finally {
    setLoading(false);
  }
};


  const handleResendOtp = async () => {
    try {
      if (!email) {
        return toast.error("Email not found in state!");
      }
      setResending(true);

      const res = await AuthApiServices.sendResetOtp(email);
      toast.success(res.message, "OTP resent successfully!");
      setTimer(60);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout>
      <div
        style={{ marginLeft: "1%", width: "109%", marginTop: "-2%" }}
        className="d-flex vh-100 justify-content-center align-items-center bg-light"
      >
        <Row className="w-100 justify-content-center">
          <Col>
            {/* <Card
              style={{ backgroundColor: "#f8f9fa" }}
              className="p-4 border-0"
            >
              <Card.Body> */}
                <div className="text-center">
                  <img
                    src={logo}
                    alt="Logo"
                    className="text-center mb-4"
                    style={{ width: "150px" }}
                  />
                  <h4 className="mb-2 fw-bold">OTP Verification</h4>
                  <p className="fw-semibold">
                    Please provide your otp verification
                    {/* Enter the OTP sent{" "}
                    {email ? `to ${email}` : "to your registered email"} */}
                  </p>
                </div>

                <div
                  className="d-flex justify-content-center gap-3 my-4 ms-5"
                  onPaste={handlePaste}
                >
                  {otp.map((digit, index) => (
                    <Form.Control
                      key={index}
                      type="text"
                      maxLength={1}
                      value={otp[index]}
                      ref={(el) => (inputsRef.current[index] = el)}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="text-center fw-bold input-group"
                      style={{
                        width: "50px",
                        height: "50px",
                        fontSize: "20px",
                        borderRadius: "8px",
                        boxShadow: "none",
                        outline: "none",
                        border: "1px solid #ccc",
                      }}
                    />
                  ))}
                </div>

                <Button
                  type="button"
                  onClick={handleVerifyClick}
                  disabled={loading}
                  style={{
                    backgroundColor: "#1544b1",
                    color: "white",
                    marginLeft: "17%",
                    borderRadius: "15px",
                    padding: "12px",
                  }}
                  className="w-75 btn-primary fw-bold"
                >
                  {loading ? (
                    <>
                      {/* <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Verifying... */}
                      <CustomLoader height={30} width={30} color="#fff" />
                    </>
                  ) : (
                    "Verify my account"
                  )}
                </Button>
                <div style={{ marginLeft: "38%" }} className="mt-2">
                  {timer > 0 ? (
                    <span className="text-muted">Resend OTP in {timer}s</span>
                  ) : (
                    <>
                      <span>Didn't get the code? </span>
                      <button
                        onClick={handleResendOtp}
                        className="btn btn-link p-0"
                        style={{
                          color: "#1544b1",
                          textDecoration: "none",
                          fontWeight: "bold",
                        }}
                        disabled={resending}
                      >
                        {resending ? (
                          <>
                            <CustomLoader
                              height={30}
                              width={30}
                              color="#1544b1"
                            />
                          </>
                        ) : (
                          "Resend OTP"
                        )}
                      </button>
                    </>
                  )}
                </div>
              {/* </Card.Body>
            </Card> */}
          </Col>
        </Row>
      </div>
    </AuthLayout>
  );
};

export default OtpVerify;
