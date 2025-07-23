import axios from "axios";
import AuthApi from "../utils/ApiConstant";
import SessionManager from "../utils/SessionManager";

const login = async (data) => {
  const response = await axios.post(AuthApi.LOGIN, data);
  return response.data;
};

const verifyLoginOtp = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(AuthApi.VERIFY_LOGIN, data, config);
  return response.data;
};

const sendResetOtp = async (email) => {
  const response = await axios.post(AuthApi.SEND_OTP, { email });
  console.log("email", email);

  return response.data;
};

const verifyResetOtp = async (data) => {
  const response = await axios.post(AuthApi.VERIFY_RESET, data);
  return response.data;
};

const resetPassword = async (data) => {
  const response = await axios.post(AuthApi.RESET_PASS, data);
  return response.data;
};

const getAdminDetails = async () => {
  const token = SessionManager.shared.getSessionToken();
  const response = await axios.get(AuthApi.ADMIN_DETAIL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const AuthApiServices = {
  login,
  verifyLoginOtp,
  sendResetOtp,
  verifyResetOtp,
  resetPassword,
  getAdminDetails,
};

export default AuthApiServices;
