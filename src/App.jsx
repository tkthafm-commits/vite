import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import ErrorBoundary from "./ErrorBoundary.jsx";

// Redirects to external URLs (bizscore.com etc.)
function ExternalRedirect({ to }) {
  useEffect(() => { window.location.href = to; }, [to]);
  return null;
}

import Home from "./Home.jsx";
import DentistDemo from "./DentistDemo.jsx";
import ZidlyApp from "./pages/ZidlyApp.jsx";
import DentalLanding from "./pages/DentalLanding.jsx";
import DentalSpecialties from "./pages/DentalSpecialties.jsx";
import Groups from "./pages/Groups.jsx";
import Switch from "./pages/Switch.jsx";
import Verticals from "./pages/Verticals.jsx";
import VsCompetitor from "./pages/VsCompetitor.jsx";
import VsPodium from "./pages/VsPodium.jsx";
import Rankings from "./pages/Rankings.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Core ── */}
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<DentistDemo />} />
        <Route path="/app" element={<ZidlyApp />} />

        {/* ── Dental ── */}
        <Route path="/dentists" element={<DentalLanding />} />
        <Route path="/dental-bizscorer" element={<ExternalRedirect to="https://bizscore.com" />} />
        <Route path="/implant-dentists" element={<DentalSpecialties />} />
        <Route path="/cosmetic-dentists" element={<DentalSpecialties />} />
        <Route path="/invisalign-providers" element={<DentalSpecialties />} />

        {/* ── Verticals ── */}
        <Route path="/medspa" element={<Verticals />} />
        <Route path="/lawyers" element={<Verticals />} />
        <Route path="/homeservices" element={<Verticals />} />
        <Route path="/restaurants" element={<Verticals />} />
        <Route path="/realestate" element={<Verticals />} />

        {/* ── vs / comparison ── */}
        <Route path="/vs/podium" element={<VsPodium />} />
        <Route path="/vs/:slug" element={<VsCompetitor />} />

        {/* ── Marketing ── */}
        <Route path="/switch" element={<Switch />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/rankings/:vertical/:city" element={<Rankings />} />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
