import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // load user from local storage
  useEffect(() => {
    const loggedUser = window.localStorage.getItem("user");
    if (loggedUser) {
      try {
        const user = JSON.parse(loggedUser);
        setUser(user);
      } catch (error) {
        window.localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // login function that save JWT into localstorage
  const login = async (email, password) => {
    try {
      const user = await authService.login({ email, password });
      window.localStorage.setItem("token", user.token);
      window.localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  // logout function that remove JWT from localstorage
  const logout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};
