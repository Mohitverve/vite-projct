// src/App.js
import React from 'react';
import Attendance from '../components/Attendance';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import '@fontsource/poppins';
import AppHeader from '../components/Header'

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, Arial',
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppHeader/>
      <Attendance />
    </ThemeProvider>
  );
};

export default App;
