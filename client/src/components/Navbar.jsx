import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          WasteWise <span className="dot" />
        </Link>
        <ul className="navbar-links">
          <li><Link to="/identify" style={{ color: pathname === "/identify" ? "#0a0a0a" : undefined }}>Route Waste</Link></li>
          <li><Link to="/facilities" style={{ color: pathname === "/facilities" ? "#0a0a0a" : undefined }}>Map</Link></li>
          <li><Link to="/donations" style={{ color: pathname === "/donations" ? "#0a0a0a" : undefined }}>Community Board</Link></li>
        </ul>
      </div>
    </nav>
  );
}
