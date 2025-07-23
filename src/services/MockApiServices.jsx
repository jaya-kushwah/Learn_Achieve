import axios from "axios";
import ApiConstant from "../utils/ApiConstant";

const MockApiServices = {
  createMockTest: async (payload, id = null, token) => {
    try {
      const url = ApiConstant.ADD_OR_UPDATE;
      if (id) {
        payload.id = id;
      }
      const headers = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(url, payload, headers);
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Something went wrong" };
    }
  },

  getPaginatedMockTests: async (query = "", limit = 10, offset = 0, token) => {
    try {
      const response = await axios.get(ApiConstant.LIST, {
        headers: { Authorization: `Bearer ${token}` },
        params: { query, limit, offset },
      });

      const mockTestsWithCount = response.data.mockTests.map((mock) => ({
        ...mock,
        packageCount: mock.packageCount || 0,
      }));

      console.log("API Response:", response.data);
      console.log("API Response Count:", mockTestsWithCount);

      return {
        ...response.data,
        mockTests: mockTestsWithCount,
      };
    } catch (error) {
      throw error.response?.data || { message: "Something went wrong" };
    }
  },

  deleteMockTests: async (data, token) => {
    try {
      const response = await axios.delete(ApiConstant.DELETE, {
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

  changeMockTestStatus: async (id, status, token) => {
    try {
      const response = await axios.put(
        `${ApiConstant.STATUS_CHANGE}/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Something went wrong" };
    }
  },

  getAllClasses: async (token) => {
    try {
      const response = await axios.get(ApiConstant.CLASS_LIST, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Class API response:", response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch class list" };
    }
  },

  getSubjectsByClassId: async (classId, token) => {
    try {
      const response = await axios.get(
        `${ApiConstant.SUBJECT_BY_CLASS}/${classId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Subject API Response", response.data);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Failed to fetch subjects for class" }
      );
    }
  },
};

export default MockApiServices;
