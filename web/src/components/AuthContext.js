import React, { createContext, useState, useContext } from 'react';

// 1. SINGLETON INSTANCE HOLDER
// We create a single context reference that the entire application will share.
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 2. SINGLE INSTANCE STATE
  // These states represent the single source of truth for authentication.
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const login = async (credentials, isGuest = false) => {
    if (isGuest) {
      const guestUser = { 
        name: 'Guest User', 
        role: 'guest', 
        isGuest: true, 
        userId: 0 
      };
      setUser(guestUser);
      return { success: true };
    }

    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: credentials.userEmail,
          userPassword: credentials.userPassword
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        const userData = {
          userId: data.userId,
          email: credentials.userEmail,
          role: 'admin', // You might want to update this to pull the actual role from 'data'
          isGuest: false
        };

        setToken(data.token);
        setUser(userData);

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));

        return { success: true };
      } else {
        return { success: false, message: "Invalid credentials" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Server connection failed" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. GLOBAL ACCESS POINT
// This hook is the only way components can interact with the Singleton instance.
// It guarantees every component gets the exact same authentication data.
export const useAuth = () => useContext(AuthContext);