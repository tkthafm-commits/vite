import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, Component } from "react";
// Redirects to external URLs (bizscore.com etc.)
function ExternalRedirect({ to }) {
  useEffect(() => { window.location.href = to; }, [to]);
  return null;
}

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error("React Error:", error, info); }
  render() {
    if (this.state.error) {
      return <div style={{ padding: 40, fontFamily: "monospace", color: "red" }}>
        <h1>Something went wrong</h1>
        <pre>{this.state.error.message}</pre>
        <pre>{this.state.error.stack}</pre>
      </div>;
    }
    return this.props.children;
  }
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
import EgyptLanding from "./pages/EgyptLanding.jsx";

export default function App() {
  return (
    <ErrorBoundary>
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

        {/* ── Regional ── */}
        <Route path="/eg" element={<EgyptLanding />} />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </ErrorBoundary>
  );
}
