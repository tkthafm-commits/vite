import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import DentistDemo from "./DentistDemo.jsx";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dentists" element={<DentistDemo />} />
      </Routes>
    </BrowserRouter>
  );
}
