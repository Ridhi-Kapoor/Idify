import { createContext, useContext, useEffect, useState } from "react";

const AuthCtx = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const saved = localStorage.getItem("idify_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);
  const login = (payload) => {
    const u = { id: payload.userId, role: payload.role || "student", name: "Aditya Kumar" };
    setUser(u);
    localStorage.setItem("idify_user", JSON.stringify(u));
  };
  const logout = () => { setUser(null); localStorage.removeItem("idify_user"); };
  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>;
}
export const useAuth = () => useContext(AuthCtx);
