import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/layout/AdminSidebar";
import Navbar from "../components/layout/Navbar";

// initial admin details
const mockAdmin = {
  name: "Minindu R.",
  firstName: "Minindu",
  role: "Admin",
};

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: clear auth token, then redirect
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#1E2A4A]">
      <AdminSidebar onLogout={handleLogout} />

      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 rounded-l-3xl">
        <Navbar user={mockAdmin} />

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}