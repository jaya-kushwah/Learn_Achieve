import React, { useState } from "react";
import { Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaEnvelope } from "react-icons/fa";
import AuthLayout from "../../Layout/AuthLayout";
import logo from "../../assets/Images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthApiServices from "../../services/AuthApiServices";
import RoutesPath from "../../utils/RoutesPath";
import CustomInput from "../../Components/resusable/CustomInput";
import CustomLoader from "../../Components/resusable/CustomLoader";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgetPasswordValidationSchema } from "../../utils/utils";

const ForgetPass = () => {
  // const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

const {
  control,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: yupResolver(forgetPasswordValidationSchema),
});


  const onSubmit = async (data) => {
  const email = data.email;

  try {
    setLoading(true);
    const result = await AuthApiServices.sendResetOtp(email);
    toast.success(result.message || "OTP sent successfully!");
    navigate(RoutesPath.verifyOtp, { state: { email } });
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to send OTP.");
  } finally {
    setLoading(false);
  }
};


  // const onSubmit = async (e) => {
  //   e.preventDefault();

  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //   if (!email) return toast.error("Please enter your email!");
  //   if (!emailRegex.test(email))
  //     return toast.error("Please enter a valid email address!");

  //   try {
  //     setLoading(true);
  //     const result = await AuthApiServices.sendResetOtp(email);
  //     toast.success(result.message || "OTP sent successfully!");
  //     navigate(RoutesPath.verifyOtp, { state: { email } });
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Failed to send OTP.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <AuthLayout>
      <div
        style={{ marginLeft: "1%", width: "109%", marginTop: "-2%" }}
        className="d-flex vh-100 justify-content-center align-items-center bg-light"
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
                  <h4 className="mb-2 fw-bold">Forgot your password?</h4>
                  <p className="fw-semibold">
                    Please provide your email for verification
                  </p>
                </div>

                <Form onSubmit={handleSubmit(onSubmit)}>
                  {/* <CustomInput
                    label="Email Id"
                    controlId="formEmail"
                    type="email"
                    icon={<FaEnvelope style={{ color: "#a3a3a3" }} />}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                     highlightOnHover={true} 
                  /> */}
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
                      Send OTP
                    </Button>
                  )}

                  <div className="mt-2 fw-semibold">
                    <Link
                      to={RoutesPath.login}
                      style={{
                        color: "#1544b1",
                        textDecoration: "none",
                        marginLeft: "44%",
                      }}
                    >
                      &lt; Back to Login
                    </Link>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </AuthLayout>
  );
};

export default ForgetPass;
