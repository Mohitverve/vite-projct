import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './components/firebase';

import Admin from './components/Admin';
import Register from './components/Register';
import Login from './components/Login';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null: still determining, false: not authenticated, true: authenticated
  const [isAdmin, setIsAdmin] = useState(false); // State to track if the user is an admin

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);

        // Check for admin role
        const idTokenResult = await user.getIdTokenResult();
        if (idTokenResult.claims.admin) {
          setIsAdmin(true); // User is an admin
        } else {
          setIsAdmin(false); // User is not an admin
        }
      } else {
        setIsAuthenticated(false); // User is not authenticated
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated === true ? (
                <Navigate to="/Home" />
              ) : isAuthenticated === false ? (
                <Navigate to="/Register" />
              ) : (
                <div>Loading...</div> // Optional loading screen while auth status is determined
              )
            }
          />
          <Route
            path="/Home"
            element={
              isAuthenticated ? <Home /> : <Navigate to="/Register" />
            }
          />
          <Route
            path="/Register"
            element={!isAuthenticated ? <Register /> : <Navigate to="/Login" />}
          />
          <Route
            path="/Login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/Home" />}
          />
          {/* Protect Admin page with Admin Check */}
          <Route
            path="/Admin"
            element={isAdmin ? <Admin /> : <Navigate to="/Home" />}
          />
          {/* Catch-all route for unauthenticated users */}
          {isAuthenticated === false && (
            <Route path="*" element={<Navigate to="/Register" />} />
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
