import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import HomePage from "./components/HomePage/HomePage.jsx";
import EventsPage from "./components/EventsPage/EventsPage.jsx";
import EventDetail from "./components/EventDetail/EventDetail.jsx";
import LoginPage from "./components/LoginPage/LoginPage.jsx";
import RegisterPage from "./components/RegisterPage/RegisterPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./main.css";
// Cart model: cart items are stored in localStorage via CartContext (no backend needed).
// At checkout, the cart is POSTed to POST /api/orders and then cleared.
// CartContext should follow the same pattern as AuthContext — see that file for reference.

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "events", element: <EventsPage /> },
      { path: "events/:id", element: <EventDetail /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
