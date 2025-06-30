
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./ios-safari-fixes.css";
import App from "./index.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <App />
      <SpeedInsights />
      <Analytics />
    </CartProvider>
  </StrictMode>,
);
