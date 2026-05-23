import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MatchiProvider } from "./context/MatchiContext";
import LandingPage from "./pages/LandingPage";
import WorkspacePage from "./pages/WorkspacePage";

export default function App() {
  return (
    <MatchiProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/match" element={<WorkspacePage />} />
        </Routes>
      </BrowserRouter>
    </MatchiProvider>
  );
}
