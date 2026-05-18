import { createRoot } from "react-dom/client";
import ErrorBoundary from "@/app/providers/ErrorBoundary";
import App from "./App.tsx";
import "./index.css";
import { initializeTracker } from "./analytics/eventTracker";

// Initialize analytics tracker
initializeTracker();

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found.");
}

createRoot(rootElement).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
