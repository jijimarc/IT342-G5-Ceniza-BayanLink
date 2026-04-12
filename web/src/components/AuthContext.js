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
        role: 'Guest', // Standardized casing
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

      // Parse the outer JSON
      const jsonResponse = await response.json();

      // Check BOTH response.ok and your SDD's custom jsonResponse.success flag
      if (response.ok && jsonResponse.success) {
        
        // Extract the actual payload from the "data" wrapper defined in your SDD
        const payload = jsonResponse.data; 
        
        const fName = payload.userFirstname || payload.firstname || '';
        const lName = payload.userLastname || payload.lastname || '';
        const fullName = `${fName} ${lName}`.trim();

        const userData = {
          userId: payload.userId, 
          email: payload.userEmail || credentials.userEmail,
          fullname: fullName !== '' ? fullName : (payload.userEmail || credentials.userEmail),
          // Store the role exactly as the backend sends it, fallback to Resident
          role: payload.role || 'Resident', 
          isGuest: false
        };

        setToken(payload.token);
        setUser(userData);

        localStorage.setItem('token', payload.token);
        localStorage.setItem('user', JSON.stringify(userData));

        return { success: true };
      } else {
        // Use the specific error message from your backend if available
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