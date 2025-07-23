import axios from "axios";
import ApiConstant from "../utils/ApiConstant";

const UserServices = {
  // ✅ Add Personal Details
  addPersonalDetails: async (data) => {
    try {
      const response = await axios.post(ApiConstant.REGISTER, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Server Error" };
    }
  },

  // ✅ Add Contact Details
  addContactDetails: async (data) => {
    try {
      const response = await axios.post(ApiConstant.CONTACT, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Server Error" };
    }
  },

  // ✅ Verify OTP and Final Registration
  verifyOtpAndRegister: async (data) => {
    try {
      const response = await axios.post(ApiConstant.VERIFY, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Server Error" };
    }
  }
};

export default UserServices;
