import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
// import Home from "./pages/Home";
import AudioPlayground from "./pages/AudioPlayground";
import Footer from "./components/Footer";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-black">
        <div className="flex-1">
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/" element={<AudioPlayground />} />
            <Route path="/audio" element={<AudioPlayground />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  </StrictMode>,
);
