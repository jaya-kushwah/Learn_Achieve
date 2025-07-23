import Cookies from "js-cookie";

const SESSION_TOKEN = "SessionToken";
const USER_DATA = "USERDATA";
const COOKIE_EXPIRY = 1;

class SessionManager {
  static shared = new SessionManager();
  // tokenListener = [];
  // dataListener = [];

  setSessionToken(token) {
    Cookies.set(SESSION_TOKEN, token, { expires: COOKIE_EXPIRY });
    // this.notifyTokenListeners();
  }

  getSessionToken() {
    return Cookies.get(SESSION_TOKEN);
  }

 retrieveUserData() {
  const userData = Cookies.get(USER_DATA);
  try {
    if (userData && userData !== "undefined") {
      return JSON.parse(userData);
    }
    return null;
  } catch (e) {
    console.error("Invalid JSON in USERDATA cookie:", e);
    return null;
  }
}


  // setForgotPasswordToken(token) {
  //     localStorage.getItem(FORGOT_PASSWORD_TOKEN, token);
  // }

  // getForgotPasswordToken(token) {
  //     return localStorage.getItem(FORGOT_PASSWORD_TOKEN);
  // }

 storeUserData(user) {
  if (user && typeof user === "object") {
    Cookies.set(USER_DATA, JSON.stringify(user), { expires: COOKIE_EXPIRY });
  } else {
    console.warn("Invalid user data, not storing in cookie:", user);
  }
}


  logout() {
    Cookies.remove(SESSION_TOKEN);
    Cookies.remove(USER_DATA);
  }
}

export default SessionManager;
