import axios from "axios";
import ApiConstant from "../utils/ApiConstant";

const UserServices = {
   registerStudent: async (data) => {
    try {
      const response = await axios.post(ApiConstant.REGISTER, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: "Server Error" };
    }
  },

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
