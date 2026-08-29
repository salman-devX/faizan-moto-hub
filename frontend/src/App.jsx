import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { useAuth } from "./context/AuthContext.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import ServiceDept from "./pages/ServiceDept.jsx";
import Contact from "./pages/Contact.jsx";
import RequestPage from "./pages/RequestPage.jsx";
import Track from "./pages/Track.jsx";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Staff from "./pages/Staff.jsx";
import Admin from "./pages/Admin.jsx";

function Protected({ children, role }) {
  const { user, loading, isAdmin, staffDept } = useAuth();
  if (loading) return <div className="container-page py-24 text-center text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (role === "admin" && !isAdmin) return <Navigate to="/dashboard" replace />;
  if (role === "staff" && !staffDept && !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:dept" element={<ServiceDept />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/track" element={<Track />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/request" element={<RequestPage />} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/staff" element={<Protected role="staff"><Staff /></Protected>} />
        <Route path="/admin" element={<Protected role="admin"><Admin /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
