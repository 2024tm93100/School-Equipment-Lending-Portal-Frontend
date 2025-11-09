import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from 'react';

// Components
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EquipmentList from "./pages/EquipmentList";
import EquipmentForm from "./pages/EquipmentForm";
import BorrowRequestList from "./pages/BorrowRequestList";
import BorrowRequestForm from "./pages/BorrowRequestForm";
import ApprovalRequests from "./pages/ApprovalRequests";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Navbar /> {/* Renders the navigation bar on all pages */}
      <div className="container mt-4">
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Default Redirect to Dashboard (if logged in) or Login */}
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* -------------------- Protected Routes (Require Login) -------------------- */}

          <Route
            path="/dashboard"
            element={ <PrivateRoute><Dashboard /></PrivateRoute> }
          />
          <Route
            path="/profile"
            element={ <PrivateRoute><Profile /></PrivateRoute> }
          />
          
          {/* Equipment Routes (Admin/Staff focused) */}
          <Route
            path="/equipment"
            element={ <PrivateRoute requiredRole="ADMIN"><EquipmentList /></PrivateRoute> }
          />
          <Route
            path="/equipment/add"
            element={ <PrivateRoute requiredRole="ADMIN"><EquipmentForm /></PrivateRoute> }
          />
          <Route
            path="/equipment/edit/:id"
            element={ <PrivateRoute requiredRole="ADMIN"><EquipmentForm /></PrivateRoute> }
          />

          {/* Request Routes (Student focused) */}
          <Route
            path="/requests"
            element={ <PrivateRoute requiredRole={["STUDENT","ADMIN", "STAFF"]}><BorrowRequestList /></PrivateRoute> }
          />
          <Route
            path="/requests/new"
            element={ <PrivateRoute requiredRole={["STUDENT", "ADMIN", "STAFF"]}><BorrowRequestForm /></PrivateRoute> }
          />

          {/* Approval Routes (Staff/Admin focused) */}
          <Route
            path="/approvals"
            element={ <PrivateRoute requiredRole={["ADMIN", "STAFF"]}><ApprovalRequests /></PrivateRoute> }
          />
        
          {/* Fallback for 404 - optional */}
          <Route path="*" element={<h2 className="text-danger">404 Not Found</h2>} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;