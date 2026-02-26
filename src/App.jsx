import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FindBlood from "./pages/FindBlood";
import Community from "./pages/Community";
import Rewards from "./pages/Rewards";

import AdminDashboard from "./pages/admin/AdminDashboard";
import BloodbankDashboard from "./pages/bloodbank/BloodbankDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import ManageDonors from "./pages/admin/ManageDonors";
import ManageEvents from "./pages/admin/ManageEvents";
import AdminUsers from "./pages/admin/AdminUsers";
import Reports from "./pages/admin/Reports";
import EventDetails from "./pages/admin/EventDetails";
import RequestBlood from "./pages/user/RequestBlood";
import ManageRequests from "./pages/admin/ManageRequests";
import DonateBlood from "./pages/user/DonateBlood";
import AdminBenefit from "./pages/admin/AdminBenefit";
import PublicEvents from "./pages/PublicEvents";
import PublicEventDetails from "./pages/PublicEventDetails";



import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />

        <Route path="/findblood" element={<FindBlood />} />
        <Route path="/community" element={<Community />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/donors"
          element={
            <ProtectedRoute role="admin">
              <ManageDonors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute role="admin">
              <ManageEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events/:id"
          element={
            <ProtectedRoute role="admin">
              <EventDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute role="admin">
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/benefit"
          element={
            <ProtectedRoute role="admin">
              <AdminBenefit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/requests"
          element={
            <ProtectedRoute role="admin">
              <ManageRequests />
            </ProtectedRoute>
          }
        />

        {/* Blood Bank */}
        <Route
          path="/bloodbank"
          element={
            <ProtectedRoute role="bloodbank">
              <BloodbankDashboard />
            </ProtectedRoute>
          }
        />

        {/* User */}
        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/request"
          element={
            <ProtectedRoute role="user">
              <RequestBlood />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/donate"
          element={
            <ProtectedRoute role="user">
              <DonateBlood />
            </ProtectedRoute>
          }
        />
        <Route path="/events" element={<PublicEvents />} />
        <Route path="/events/:id" element={<PublicEventDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
