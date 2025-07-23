import axios from "axios";
import ApiConstant from "../utils/ApiConstant";

const QuestionApiServices = {
  createOrUpdateQuestion: (data, token) => {
    const url = data.id
      ? ApiConstant.QUESTION_ADD_OR_UPDATE 
      : ApiConstant.QUESTION_ADD_OR_UPDATE;

    return axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Add Sub Question
  addSubQuestion: (data, token) => {
    return axios.post(ApiConstant.SUBQUESTION_ADD, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get Sub Questions by Parent Question ID
  getSubQuestions: (parentId, token) => {
    return axios.get(`${ApiConstant.SUBQUESTION_LIST}${parentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Delete Sub Question
  deleteSubQuestion: (id, token) => {
    return axios.delete(`${ApiConstant.SUBQUESTION_DELETE}${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Change Question Status
  changeQuestionStatus: async (id, status, token) => {
    const response = await axios.put(
      `${ApiConstant.QUESTION_STATUS_CHANGE}/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("hvhgjjmhghjkl", response.data);
    return response.data;
  },

  //Delete Main Question
  deleteQuestion: async (data, token) => {
    try {
      const response = await axios.delete(ApiConstant.QUESTION_DELETE, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data,
      });
      return response.data;
    } catch (error) {
      console.error("Delete API Error:", error);
      throw error.response?.data || { message: "Something went wrong" };
    }
  },

  //  Filter Questions
  filterQuestions: (params, token) => {
    return axios.get(ApiConstant.QUESTION_FILTER, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default QuestionApiServices;
