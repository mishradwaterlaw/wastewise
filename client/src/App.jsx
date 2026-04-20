import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WasteProvider } from "./context/WasteContext";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Identify from "./pages/Identify";
import Results from "./pages/Results";
import Facilities from "./pages/Facilities";
import Donations from "./pages/Donations";

function App() {
  return (
    <WasteProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/"           element={<Landing />} />
          <Route path="/identify"   element={<Identify />} />
          <Route path="/results"    element={<Results />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/donations"  element={<Donations />} />
        </Routes>
      </Router>
    </WasteProvider>
  );
}

export default App;