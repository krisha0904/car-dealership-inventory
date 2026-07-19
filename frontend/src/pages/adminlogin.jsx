import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.is_admin) {
        localStorage.setItem(
          "admin_token",
          response.data.access_token
        );

        alert("Admin Login Successful");

        navigate("/admin/panel");
      } else {
        alert("Access Denied! You are not an Admin.");
      }
    } catch (error) {
      alert("Invalid Admin Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800">

      <div className="bg-white shadow-2xl rounded-2xl p-10 w-[420px]">

        <div className="text-center mb-8">

          <div className="text-6xl mb-3">
            🔐
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            Admin Login
          </h1>

          <p className="text-gray-500 mt-2">
            Administrator Authentication Required
          </p>

        </div>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleAdminLogin}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Login as Admin
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full mt-3 border border-gray-400 text-gray-700 py-3 rounded-lg hover:bg-gray-100 transition"
        >
          Back to Dashboard
        </button>

      </div>

    </div>
  );
}