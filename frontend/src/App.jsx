import { Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SwipePage from "./pages/SwipePage";
import Selected from "./pages/Selected";
import StackList from "./pages/StackList";
import CreateStack from "./pages/CreateStack";
import RemixStack from "./pages/RemixStack";

export default function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const isAuthenticated = !!localStorage.getItem("googleToken");

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="/category/:categoryId/stacks"
          element={isAuthenticated ? <StackList /> : <Navigate to="/login" />}
        />
        <Route
          path="/stacks/:stackId"
          element={isAuthenticated ? <SwipePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/stacks/:categoryId/create"
          element={isAuthenticated ? <CreateStack /> : <Navigate to="/login" />}
        />
        <Route
          path="/stacks/:stackId/remix"
          element={isAuthenticated ? <RemixStack /> : <Navigate to="/login" />}
        />
        <Route
          path="/selected"
          element={isAuthenticated ? <Selected /> : <Navigate to="/login" />}
        />
      </Routes>
    </GoogleOAuthProvider>
  );
}
