import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("is_admin");
    localStorage.removeItem("admin_token");
    navigate("/");
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <h1 className="text-2xl font-bold text-cyan-400">
          🚗 Car Inventory
        </h1>

        {/* Navigation */}
        <div className="flex gap-5 items-center">

          <Link
            to="/dashboard"
            className="hover:text-cyan-400 transition"
          >
            Dashboard
          </Link>

          {/* Always visible */}
          <Link
            to="/admin"
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
          >
            Admin
          </Link>

          <button
            onClick={logout}
            className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>

        </div>

      </div>
    </nav>
  );
}