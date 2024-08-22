import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import 'react-date-range/dist/styles.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
if(process.env.NODE_ENV !== "development") {
  console.log = () => {};
}
root.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);

reportWebVitals();
