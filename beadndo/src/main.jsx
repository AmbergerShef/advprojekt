import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/site.css";

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

if (window.location.hash) {
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
}

window.scrollTo(0, 0);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
