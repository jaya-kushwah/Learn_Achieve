import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext, AuthContextProvider } from "./context/AuthContext";
import RoutesPath from "./utils/RoutesPath";
import MockAdd from "./Pages/MockTest/MockAdd";
import MockView from "./Pages/MockTest/MockView";
import PackageView from "./Pages/Packages/PackageView";
import PackageAdd from "./Pages/Packages/PackageAdd";
import Login from "./Pages/AuthPages/Login";
import ForgetPass from "./Pages/AuthPages/ForgetPass";
import OtpVerify from "./Pages/AuthPages/OtpVerify";
import ConfirmPass from "./Pages/AuthPages/ConfirmPass";
import AddQuestion from "./Pages/QuestionBank/AddQuestion";
import ViewQuestion from "./Pages/QuestionBank/ViewQuestion";
import UserSignup from "./Pages/Registration/UserSignup";

const AppRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Routes>
      <Route path={RoutesPath.login} element={<Login />} />
      <Route path={RoutesPath.forgot} element={<ForgetPass />} />
      <Route path={RoutesPath.verifyOtp} element={<OtpVerify />} />
      <Route path={RoutesPath.resetPassword} element={<ConfirmPass />} />

      {isAuthenticated ? (
        <>
          <Route path={RoutesPath.viewMock} element={<MockView />} />
          <Route path={RoutesPath.addMock} element={<MockAdd />} />
          <Route path={RoutesPath.viewPackage} element={<PackageView />} />
          <Route path={RoutesPath.addPackage} element={<PackageAdd />} />
          <Route path={RoutesPath.addQuestion} element={<AddQuestion></AddQuestion>} />
          <Route path={RoutesPath.viewQuestion} element={<ViewQuestion></ViewQuestion>} />
          <Route path={RoutesPath.registration} element={<UserSignup></UserSignup>} />

          <Route path="*" element={<Navigate to={RoutesPath.viewMock} replace />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to={RoutesPath.login} replace />} />
      )}
    </Routes>
  );
};

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={2500}
          theme="colored"
          style={{
            fontSize: "14px",
            borderRadius: "8px",
            padding: "8px",
            width: "auto",
            marginTop: "10px",
            marginRight: "10px",
          }}
        />
        <AppRoutes />
      </Router>
    </AuthContextProvider>
  );
}

export default App;
