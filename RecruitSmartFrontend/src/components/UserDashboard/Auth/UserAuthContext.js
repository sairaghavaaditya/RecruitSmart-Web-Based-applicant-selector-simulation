import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  // Safely retrieve and parse localStorage data
  const [authState, setAuthState] = useState(() => {
    try {
      const storedState = localStorage.getItem('authState');
      return storedState ? JSON.parse(storedState) : null;
    } catch (error) {
      console.error("Error parsing authState from localStorage:", error);
      return null; // Fallback if JSON parsing fails
    }
  });

 const login = (user) => {
    if (user) {
      setAuthState(user);
      localStorage.setItem('authState', JSON.stringify(user));
    }
  };

  const logout = () => {
    setAuthState(null);
    localStorage.removeItem('authState');
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
