
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginsigin/LoginPage";
import SignupPage from "./pages/loginsigin/SIgnupPage.jsx";
import ActivationPage from "./pages/AgentActivation/ActivationPage";
import AlarmsPage from "./pages/extra_pages/AlarmsPage/index.jsx"
import InsightsPage from "./pages/extra_pages/InsightsPage/InsightsPage.jsx";
import ProductivityPage from "./pages/productivity/productivity.jsx";
import ActivityLog from "./pages/productivity/ActivityLog.jsx";
import WorkingHours from "./pages/productivity/WorkingHours.jsx";
import ProductivityGraphPage from "./pages/productivity/ProductivityGraphPage.jsx";
import CoachPage from "./pages/extra_pages/CoachPage/index.jsx";
import ImpactPage from "./pages/extra_pages/ImpactPage/index.jsx";
import HelpPage from "./pages/extra_pages/HelpPage/index.jsx";
import Classification from "./pages/Settings/Classification.jsx";
import RoleAccess from "./pages/Settings/RoleAccess.jsx";
import AppAccess from "./pages/Settings/AppAccess.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import VerifyOTPPage from "./pages/loginsigin/VerifyOTPPage.jsx";
import TeamsPage from "./pages/Settings/TeamsPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage/>} />
          <Route path="/activation" element={<ActivationPage />} />
          <Route path="/alarms" element={<AlarmsPage/>} />
          <Route path="/insight" element={<InsightsPage/>}/>
          <Route path="/productivity" element={<ProductivityPage/>}/>
          <Route path="/activitylog" element={<ActivityLog/>}/>
          <Route path="/workinghours" element={<WorkingHours/>}/>
          <Route path="/productivitygraph" element={<ProductivityGraphPage/>}/>
          <Route path="/coach" element={<CoachPage/>}/>
          <Route path="/impact" element={<ImpactPage/>}/>
          <Route path="/help" element={<HelpPage/>}/>
          <Route path="/classification" element={<Classification />} />
          <Route path="/app-access" element={<AppAccess />} />
          <Route path="/role-access" element={<RoleAccess />} />
          <Route path="/verify-otp" element={<VerifyOTPPage/>}/>
          <Route path="/teams" element={<TeamsPage/>}/>
          
      </Routes>
    </Router>
  );
}

export default App;