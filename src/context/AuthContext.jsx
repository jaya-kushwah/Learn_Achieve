import SessionManager from "../utils/SessionManager";
import { useEffect, createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [isAuthenticated, setisAuthenticated] = useState(
    !!SessionManager.shared.getSessionToken()
  );

  useEffect(() => {
    const sessionToken = SessionManager.shared.getSessionToken();
    const userData = SessionManager.shared.retrieveUserData();

    if (sessionToken && sessionToken !== "") {
      setisAuthenticated(true);
    } else {
      setisAuthenticated(false);
    }

    if (userData) {
      setUser(userData);
    } else {
      setUser({ name: "JAYA" });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setisAuthenticated,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
