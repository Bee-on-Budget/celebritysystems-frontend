import { createContext, useState, useEffect } from "react";
import { getToken, decodeToken, removeToken, setToken } from "../utils/token";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const validateToken = () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return false;
    }

    const decoded = decodeToken(token);
    const isValid = decoded && decoded.exp * 1000 > Date.now();

    if (isValid) {
      setUser(decoded);
    } else {
      removeToken();
      setUser(null);
    }

    return isValid;
  };

  useEffect(() => {
    validateToken();
    setLoading(false);
  }, []);

  const login = (token) => {
    setToken(token);
    validateToken();
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, validateToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
