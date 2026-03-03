import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SwipePage from "./pages/SwipePage";
import Selected from "./pages/Selected";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/swipe/:category" element={<SwipePage />} />
      <Route path="/selected" element={<Selected />} />
    </Routes>
  );
}
