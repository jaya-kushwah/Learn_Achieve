import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import RoutesPath from "./RoutesPath";

import Login from "../Pages/AuthPages/Login";
import ForgetPass from "../Pages/AuthPages/ForgetPass";
import OtpVerify from "../Pages/AuthPages/OtpVerify";
import ConfirmPass from "../Pages/AuthPages/ConfirmPass";
import MockView from "../Pages/MockTest/MockView";
import MockAdd from "../Pages/MockTest/MockAdd";
import PackageView from "../Pages/Packages/PackageView";
import PackageAdd from "../Pages/Packages/PackageAdd";
import UserSignup from "../Pages/Registration/UserSignup";

const AllRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Routes>
      {isAuthenticated ? (
        <>
          <Route path={RoutesPath.viewMock} element={<MockView />} />
          <Route path={RoutesPath.addMock} element={<MockAdd />} />
          <Route path={RoutesPath.viewPackage} element={<PackageView />} />
          <Route path={RoutesPath.addPackage} element={<PackageAdd />} />
          <Route path={RoutesPath.registration} element={<UserSignup></UserSignup>} />
          <Route path="*" element={<Navigate to={RoutesPath.viewMock} replace />} />
        </>
      ) : (
        <>
          <Route path={RoutesPath.login} element={<Login />} />
          <Route path={RoutesPath.forgot} element={<ForgetPass />} />
          <Route path={RoutesPath.verifyOtp} element={<OtpVerify />} />
          <Route path={RoutesPath.resetPassword} element={<ConfirmPass />} />
          <Route path="*" element={<Navigate to={RoutesPath.login} replace />} />
        </>
      )}
    </Routes>
  );
};

export default AllRoutes;
