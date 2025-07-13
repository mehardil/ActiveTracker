
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
function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage/>} />
          <Route path="/activation" element={<ActivationPage />} />
          <Route path="/alarms" element={<AlarmsPage/>} />
          <Route path="/insight" element={<InsightsPage/>}/>
          <Route path="/productivity" element={<ProductivityPage/>}/>
          <Route path="/activitylog" element={<ActivityLog/>}/>
          <Route path="/workinghours" element={<WorkingHours/>}/>
          <Route path="/productivitygraph" element={<ProductivityGraphPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;