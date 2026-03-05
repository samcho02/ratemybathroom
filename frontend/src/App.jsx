import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SwipePage from "./pages/SwipePage";
import Selected from "./pages/Selected";
import StackList from "./pages/StackList";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/category/:categoryId/stacks" element={<StackList />} />
      <Route path="/stacks/:stackId" element={<SwipePage />} />
      <Route path="/stacks/:categoryId/create" element={<SwipePage />} />
      <Route path="/stacks/:stackId/remix" element={<SwipePage />} />
      <Route path="/selected" element={<Selected />} />
    </Routes>
  );
}
