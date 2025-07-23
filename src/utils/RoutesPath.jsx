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
  addQuestion:"/add_question",
  viewQuestion:"/view_question",
  registration:"/registration",
};

export default RoutesPath;
