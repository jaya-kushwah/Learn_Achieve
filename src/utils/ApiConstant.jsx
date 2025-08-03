const BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("BASE_URL:", BASE_URL);

const ADMIN_URL = BASE_URL + "api/admin/";
const MOCK_URL = BASE_URL + "api/mockTest/";
const CLASS_URL = BASE_URL + "api/classMaster/";
const SUBJECT_URL = BASE_URL + "api/subject/";
const QUESTION_URL = BASE_URL + "api/question/";
const USER_URL = BASE_URL + "api/student/";
const USERMOCK_URL = BASE_URL + "api/mockTestfetch/";

const ApiConstant = {
  //AUTHENTICATION API's
  LOGIN: ADMIN_URL + "login",
  VERIFY_LOGIN: ADMIN_URL + "verify-login-otp",
  SEND_OTP: ADMIN_URL + "send-reset-otp",
  VERIFY_RESET: ADMIN_URL + "verify-reset-otp",
  RESET_PASS: ADMIN_URL + "reset-password",
  ADMIN_DETAIL: ADMIN_URL + "me",

  // MOCK TEST APIs
  ADD_OR_UPDATE: MOCK_URL + "add",
  LIST: MOCK_URL + "list",
  DELETE: MOCK_URL + "delete",
  STATUS_CHANGE: MOCK_URL + "status",

  // CLASS MASTER APIs
  CLASS_LIST: CLASS_URL + "all",

  // SUBJECT APIs
  SUBJECT_BY_CLASS: SUBJECT_URL + "class",

  //QUESTION API's
  QUESTION_ADD_OR_UPDATE: QUESTION_URL,
  SUBQUESTION_ADD: QUESTION_URL + "subquestion",
  SUBQUESTION_LIST: QUESTION_URL + "subquestion/",
  SUBQUESTION_DELETE: QUESTION_URL + "subquestion/", // add id dynamically
  QUESTION_FILTER: QUESTION_URL + "filter",
  QUESTION_STATUS_CHANGE: QUESTION_URL + "status",
  QUESTION_DELETE: QUESTION_URL + "delete",

  //REGISTRATION API's
  REGISTER: USER_URL + "register",
  VERIFY: USER_URL + "verify",

  //MOCK USER MCQ
  MOCK_TEST_DETAIL: USERMOCK_URL + "mocktest/",
  USER_QUESTION_BY_SUBJECT: USERMOCK_URL + "mocktest/", 
};

export default ApiConstant;
