import React, { useState } from "react";
import { Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import AuthLayout from "../../Layout/AuthLayout";
import logo from "../../assets/Images/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import AuthApiServices from "../../services/AuthApiServices";
import RoutesPath from "../../utils/RoutesPath";
import CustomInput from "../../Components/resusable/CustomInput";
import CustomLoader from "../../Components/resusable/CustomLoader"

const ConfirmPass = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;

    if (!password || !confirmPassword) {
      toast.error("Both fields are required.");
      return;
    }

    if (!passwordRegex.test(password) || !passwordRegex.test(confirmPassword)) {
      toast.error(
        "Password must be at least 6 characters, including letters and numbers."
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!email) {
      toast.error("Email not found in session. Please try again.");
      return;
    }

    try {
       setLoading(true);
      const response = await AuthApiServices.resetPassword({
        email,
        newPassword: password,
      });
      toast.success(response.message || "Password reset successful!");
      navigate(RoutesPath.login);
      // navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div
        style={{ marginLeft: "1%", width: "109%", marginTop: "-2%" }}
        className="d-flex vh-100 justify-content-center align-items-center bg-light "
      >
        <Row className="w-100 justify-content-center">
          <Col>
            <Card
              style={{ backgroundColor: "#f8f9fa" }}
              className="p-4 border-0"
            >
              <Card.Body>
                <div className="text-center">
                  <img
                    src={logo}
                    alt="Logo"
                    className="text-center mb-4"
                    style={{ width: "150px" }}
                  />
                  <h4 className="mb-2 fw-bold">Set Your New Password</h4>
                  <p className="fw-semibold">
                    Please enter your new password and confirm it
                  </p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <CustomInput
                    label="Password"
                    controlId="formPassword"
                    type={showPassword ? "text" : "password"}
                    icon={<FaLock style={{ color: "#a3a3a3" }} />}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    showToggleIcon={true}
                    showPassword={showPassword ? <FaEye /> : <FaEyeSlash />}
                    onToggle={toggleShowPassword}
                  />

                  <CustomInput
                    label="Confirm Password"
                    controlId="formConfirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    icon={<FaLock style={{ color: "#a3a3a3" }} />}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    showToggleIcon={true}
                    showPassword={
                      showConfirmPassword ? <FaEye /> : <FaEyeSlash />
                    }
                    onToggle={toggleShowConfirmPassword}
                  />
                  
                  {loading ? (
                    <Button
                      disabled
                      className="w-75 fw-bold"
                      style={{
                        backgroundColor: "#1544b1",
                        color: "white",
                        marginLeft: "17%",
                        borderRadius: "15px",
                        padding: "12px",
                      }}
                    >
                         <CustomLoader height={30} width={30} color="#fff" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="w-75 btn-primary fw-bold"
                      style={{
                        backgroundColor: "#1544b1",
                        color: "white",
                        marginLeft: "17%",
                        borderRadius: "15px",
                        padding: "12px",
                      }}
                    >
                          Set Password
                    </Button>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </AuthLayout>
  );
};

export default ConfirmPass;
