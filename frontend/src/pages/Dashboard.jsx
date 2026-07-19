import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");

  // Load all vehicles
  const loadVehicles = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/vehicles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVehicles(response.data);
    } catch (error) {
      console.error("Error loading vehicles:", error);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  // Search vehicles by make
  const searchVehicle = async () => {
    try {
      const token = localStorage.getItem("token");

      if (search.trim() === "") {
        loadVehicles();
        return;
      }

      const response = await api.get(
        `/vehicles/search?make=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVehicles(response.data);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  // Purchase vehicle
  const purchaseVehicle = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        `/vehicles/${id}/purchase`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh vehicle list
      loadVehicles();

      alert("Vehicle purchased successfully!");
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Purchase failed.");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-6">
        Car Inventory
      </h1>

      {/* Search Section */}
      <div className="mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Search by make..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchVehicle();
            }
          }}
          className="border p-2 rounded w-80"
        />

        <button
          onClick={searchVehicle}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Search
        </button>

        <button
          onClick={loadVehicles}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Show All
        </button>
      </div>

      {/* Vehicle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {vehicles.length === 0 ? (
          <p className="text-gray-500">
            No vehicles found.
          </p>
        ) : (
          vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="border rounded-lg p-5 shadow"
            >
              <h2 className="text-xl font-bold">
                {vehicle.make} {vehicle.model}
              </h2>

              <p className="mt-2">
                <strong>Category:</strong> {vehicle.category}
              </p>

              <p>
                <strong>Price:</strong> ₹{vehicle.price}
              </p>

              <p>
                <strong>Stock:</strong> {vehicle.quantity}
              </p>

              <button
                onClick={() => purchaseVehicle(vehicle.id)}
                disabled={vehicle.quantity === 0}
                className="bg-blue-600 text-white px-4 py-2 mt-4 rounded disabled:bg-gray-400"
              >
                {vehicle.quantity === 0 ? "Out of Stock" : "Purchase"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}