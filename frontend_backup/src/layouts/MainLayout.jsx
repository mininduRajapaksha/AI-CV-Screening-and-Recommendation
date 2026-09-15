import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

//initial user details
const mockUser = {
  name: "Minindu R.",
  firstName: "Minindu",
  role: "HR Manager",
};

export default function MainLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: clear auth token, then redirect
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#EFF6FF" }}>
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 flex flex-col">
        <Navbar user={mockUser} />

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}