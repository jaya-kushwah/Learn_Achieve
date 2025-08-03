import axios from "axios";
import ApiConstant from "../utils/ApiConstant";

const UserMock = {
  getMockTestDetails: async (mockTestId) => {
    try {
      const response = await axios.get(`${ApiConstant.MOCK_TEST_DETAIL}${mockTestId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch mock test details" };
    }
  },

  getQuestionsBySubject: async (mockTestId, subjectId) => {
    try {
      const response = await axios.get(
        `${ApiConstant.USER_QUESTION_BY_SUBJECT}${mockTestId}/subject/${subjectId}/questions`
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch questions" };
    }
  }
};

export default UserMock;
