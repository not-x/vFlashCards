import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // const [token, setToken] = useLocalStorage("token", null);
  const [token, setToken_] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  // const login = async (token) => {
  //   setToken(token);
  //   navigate("/profile", { replace: true });
  // };

  const setToken = async (token) => {
    setToken_(token);
  }

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token')
    }
  }, [token]);


  const logout = () => {
    setToken(null);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      token,
      setToken,
      // login,
      logout
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
