import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./index.jsx";
import { CartProvider } from "./src/context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>,
);
