import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./ui/pages/HomePage";
import PropertyDetail from "./ui/components/property/PropertyDetail";

import "./App.css";
import OwnersPage from "./ui/pages/OwnersPage";
import OwnerDetail from "./ui/components/owner/OwnerDetail";

function App() {

  return (
    <Router>
      <div className="p-6 bg-base-200 min-h-screen flex justify-center">
        <div className="w-full max-w-7xl">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/owners" element={<OwnersPage />} />
            <Route path="/owners/:id" element={<OwnerDetail />} />
            <Route path="*" element={<div>404 - Página no encontrada</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
