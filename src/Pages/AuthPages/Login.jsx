import React, { useState, useContext } from "react";
import { Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import logo from "../../assets/Images/logon.png";
import AuthLayout from "../../Layout/AuthLayout";
import AuthService from "../../services/AuthApiServices";
import SessionManager from "../../utils/SessionManager";
import { AuthContext } from "../../context/AuthContext";
import RoutesPath from "../../utils/RoutesPath";
import CustomInput from "../../Components/resusable/CustomInput";
import CustomLoader from "../../Components/resusable/CustomLoader";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidationSchema } from "../../utils/utils";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginValidationSchema),
  });

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await AuthService.login(data);
      // SessionManager.shared.setSessionToken(res.token);
      toast.success("Login successful!");
      // navigate(RoutesPath.verifyOtp, { state: { email: data.email } }); 
      navigate(RoutesPath.verifyOtp, { state: { email: data.email, otpToken: res.token } });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div style={{ marginLeft: "1%", width: "109%", marginTop: "-2%" }} className="d-flex vh-100 justify-content-center align-items-center bg-light">
        <Row className="w-100 justify-content-center">
          <Col>
            <Card style={{ backgroundColor: "#f8f9fa" }} className="p-4 border-0">
              <Card.Body>
                <div className="text-center">
                  <img src={logo} alt="Logo" className="mb-4" style={{ width: "150px" }} />
                  <h4 className="mb-2 fw-bold">Welcome Back!</h4>
                  <p className="fw-semibold">Enter your credentials to access your account</p>
                </div>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <CustomInput
                        label="Email Id"
                        controlId="formEmail"
                        type="email"
                        icon={<FaEnvelope style={{ color: "#a3a3a3" }} />}
                        placeholder="Enter your email"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.email?.message}
                        highlightOnHover={true}
                      />
                    )}
                  />
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <CustomInput
                        label="Password"
                        controlId="formPassword"
                        type={showPassword ? "text" : "password"}
                        icon={<FaLock style={{ color: "#a3a3a3" }} />}
                        placeholder="Enter your password"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.password?.message}
                        showToggleIcon={true}
                        showPassword={showPassword ? <FaEye /> : <FaEyeSlash />}
                        onToggle={toggleShowPassword}
                      />
                    )}
                  />
                  <div className="text-end mb-3 fw-bold me-5">
                    <Link to={RoutesPath.forgot} style={{ color: "#1544b1", textDecoration: "none" }}>
                      Forgot password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-75 fw-bold"
                    style={{
                      backgroundColor: "#1544b1",
                      color: "white",
                      marginLeft: "17%",
                      borderRadius: "15px",
                      padding: "12px",
                    }}
                  >
                    {loading ? <CustomLoader height={30} width={30} color="#fff" /> : "Login"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </AuthLayout>
  );
};

export default Login;
