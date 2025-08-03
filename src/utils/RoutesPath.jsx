import AddQuestion from "../Pages/QuestionBank/AddQuestion";

const RoutesPath = {
  //AUTHENTICATION ROUTES HERE
  login: "/",
  forgot: "/forgot",
  verifyOtp: "/verify_otp",
  resetPassword: "/confirm_pass",

  //PROTECTED (REQUIRES AUTHENTICATION)
  viewMock: "/view",
  addMock: "/add",
  viewPackage: "/package_view",
  addPackage: "/package_add",
  addQuestion:"/question_add",
  viewQuestion:"/question_view",
  registration:"/registration",
  userMockTest:"/user_mock",
  userMockCard:"/card_mock",
  userMockView:"/card_view",
};

export default RoutesPath;
