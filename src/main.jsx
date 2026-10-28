import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "../app/globals.css";
import "./components/GlassButtons.css";
import "../components/InsightsFooterSpacing.css";
import "../components/HomeAboutMobileSpacing.css";
import "../components/AboutNetworkHero.css";
// Desktop-site override: forces mobile layout on Chrome "Desktop site" mode on phones
import "./styles/desktop-site-override.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
