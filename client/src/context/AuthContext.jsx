import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token,  setToken]  = useState(() => localStorage.getItem('token'));
  const [role,   setRole]   = useState(() => localStorage.getItem('role'));
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));

  const login = (token, role, userId) => {
    localStorage.setItem('token',  token);
    localStorage.setItem('role',   role);
    localStorage.setItem('userId', userId);
    setToken(token);
    setRole(role);
    setUserId(userId);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);