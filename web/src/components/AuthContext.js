import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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
        role: 'Guest', 
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

      const jsonResponse = await response.json();

      if (response.ok && jsonResponse.success) {
        
        const payload = jsonResponse.data; 
        const rawRole = payload.userRole || 'Resident';
        const formattedRole = rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase();
        const fName = payload.userFirstname || payload.userFirstname || '';
        const lName = payload.userLastname || payload.userLastname || '';
        const fullName = `${fName} ${lName}`.trim();

        const userData = {
          userId: payload.userId, 
          email: payload.userEmail,
          fullname: fullName !== '' ? fullName : payload.userEmail,
          role: formattedRole,
          isGuest: false
        };

        setToken(payload.token);
        setUser(userData);

        localStorage.setItem('token', payload.token);
        localStorage.setItem('user', JSON.stringify(userData));

        return { success: true };
      } else {
        const errorMessage = jsonResponse.error?.message || "Invalid credentials";
        return { success: false, message: errorMessage };
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

export const useAuth = () => useContext(AuthContext);