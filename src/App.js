
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginsigin/LoginPage";
import SignupPage from "./pages/loginsigin/SIgnupPage.jsx";
import ActivationPage from "./pages/AgentActivation/ActivationPage";
import AlarmsPage from "./pages/extra_pages/AlarmsPage/index.jsx"

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage/>} />
          <Route path="/activation" element={<ActivationPage />} />
          <Route path="/alarms" element={<AlarmsPage/>} />
      </Routes>
    </Router>
  );
}

export default App;