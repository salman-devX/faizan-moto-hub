import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { roleToDept } from "../lib/workshop";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = async () => {
    const token = localStorage.getItem("fmw_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { user: me } = await api.get("/api/auth/me");
      setUser(me);
    } catch {
      localStorage.removeItem("fmw_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  const login = async (email, password) => {
    const data = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("fmw_token", data.token);
    await loadMe();
    return data.user;
  };

  const register = async (fullName, phone, email, password) => {
    const data = await api.post("/api/auth/register", { fullName, phone, email, password });
    localStorage.setItem("fmw_token", data.token);
    await loadMe();
    return data.user;
  };

  const signOut = () => {
    localStorage.removeItem("fmw_token");
    setUser(null);
  };

  const value = useMemo(() => {
    const roles = user?.roles || [];
    const staffRole = ["motor", "electrical", "denter", "painter"].find((r) => roles.includes(r));
    return {
      user,
      loading,
      isAdmin: roles.includes("admin"),
      staffDept: staffRole ? roleToDept[staffRole] : null,
      fullName: user?.full_name || "",
      login,
      register,
      signOut,
      refresh: loadMe,
    };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
