import { Route, Routes } from "react-router-dom";

// =========================
// Public Pages
// =========================
import Home from "../pages/Home";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// =========================
// Agent Pages
// =========================
import { AgentDashboard } from "../pages/agent/AgentDashboard";
import AgentVerify from "../pages/agent/AgentVerify";

// =========================
// Layouts
// =========================
import Layout from "../pages/layouts/Layout";
import AdminLayout from "../pages/admin/AdminLayout";

// =========================
// Properties
// =========================
import Properties from "../pages/properties/Properties";
import View from "../pages/properties/View";
import Addimages from "../pages/agent/Addimages";
import Myproperites from "../pages/agent/Myproperites";

// =========================
// Protected Routes
// =========================
import AuthProtectedRoute from "./Protectedroutes/AuthProtectedRoute";
import VerifiedAgentProtectedRoute from "./Protectedroutes/Agent/AgentProtectedRoute";
import AdminProtectedRoute from "./Protectedroutes/admin/ProtectedAdminRoute";

// =========================
// Admin Pages
// =========================
import MainAdminDash from "../pages/admin/MainAdminDash";
import PendeingAgents from "../pages/admin/PendeingAgents";
import UsersManage from "../pages/admin/UsersManage";
import ActiveUsers from "../pages/admin/ActiveUsers";
import UserAdmin from "../pages/admin/User";
import User from "../pages/profiles/user";
import Requests from "../pages/admin/Requests";
import UserRequestHistory from "../pages/properties/UserRequestHistory";
import About from "../pages/About";
import Contatcs from "../pages/Contacts";
import AgentRequest from "../pages/agent/AgentRequests";
import AgentLayout from "../pages/agent/AgentLayout";
import CustomerProfile from "../pages/profiles/CustomerProfile";
import AgentHistoryRequests from "../pages/agent/AgentHistoryRequests";
import AgentProfile from "../pages/agent/AgentProfile";
import AddPropertyPage from "../pages/agent/Addproperity";
import Chat from "../pages/chats/Chat";
import ChatsList from "../pages/chats/ChatList";

const AppRoutes = () => {
  return (
    <Routes>
      {/* =====================================================
          Public Pages
      ===================================================== */}



      {/* =====================================================
          Authentication
      ===================================================== */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* =====================================================
          Authenticated Users

          أي User عامل Login يقدر يدخل هنا
          سواء Agent موثق أو غير موثق
      ===================================================== */}

      <Route element={<AuthProtectedRoute />}>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        {/* Profile */}

        <Route
          path="/profile"
          element={<User />}
        />

        {/* Properties */}

        <Route
          path="/properties"
          element={<Properties />}
        />

        <Route
          path="/properties/:id"
          element={<View />}
        />

        {/* Agent Verification */}

        <Route
          path="/agent/verify"
          element={<AgentVerify />}
        />

        <Route
          path="/myrequests"
          element={<UserRequestHistory />} />

        <Route
          path="/about"
          element={<About />} />
          <Route
            path="/contact"
            element={<Contatcs />} />
            <Route
              path="/chats"
              element={<ChatsList />}
              />
          <Route
            path="/chat/:userId"
            element={<Chat />} />



      </Route>

      </Route>



      <Route element={<VerifiedAgentProtectedRoute />}>
        {/* Agent Dashboard */}

        <Route path="/agent"
          element={<AgentLayout />} >



        <Route
          path="dashboard"
          element={<AgentDashboard />}
        />

        {/* My Properties */}

        <Route
          path="my-properties"
          element={<Myproperites />}
        />

        {/* Add Property Images */}

        <Route
          path="properties/:id/images"
          element={<Addimages />}
        />

        <Route
          path="requests"
          element={<AgentRequest  />}
          />
          <Route
            path="customer-profile/:id"
            element={<CustomerProfile />}
          />
          <Route
            path="request-history"
            element={<AgentHistoryRequests />}
          />

          <Route
            path="profile"
            element={<AgentProfile />}
          />
          <Route
            path="add-property"
            element={<AddPropertyPage />}
            />

</Route>
        </Route>


      {/* =====================================================
          Admin Protected Routes
      ===================================================== */}

      <Route element={<AdminProtectedRoute />}>
        <Route
          path="/admin"
          element={<AdminLayout />}
        >
          {/* /admin */}

          <Route
            index
            element={<MainAdminDash />}
          />

          {/* /admin/dashboard */}

          <Route
            path="dashboard"
            element={<MainAdminDash />}
          />

          {/* /admin/dashboard/agents/pending */}

          <Route
            path="dashboard/agents/pending"
            element={<PendeingAgents />}
          />

          {/* =================================================
              User Management
          ================================================= */}

          <Route
            path="dashboard/users/manage"
            element={<UsersManage />}
          />

          <Route
            path="dashboard/users/active"
            element={<ActiveUsers />}
          />

          <Route
            path="dashboard/users/:id"
            element={<UserAdmin />}
          />

          {/* =================================================
              Properties Management
          ================================================= */}

          {/*<Route
            path="dashboard/properties"
            element={<ProperiesAdmin />}
          />*/}

          {/* =================================================
              All Requests
          ================================================= */}

          <Route
            path="dashboard/requests"
            element={<Requests />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
