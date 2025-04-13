/** @format */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client"; // main.jsx
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./config/provider/AuthProvider";
import { Toaster } from "./AtomicComponents/atoms/shadcn/sonner";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Router>
    <AuthProvider>
      <App /> {/* No need for <Routes> here */}
      <Toaster />
    </AuthProvider>
  </Router>
  // </StrictMode>
);
