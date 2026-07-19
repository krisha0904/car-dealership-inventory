import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");

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
      console.log(error);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const searchVehicle = async () => {
    try {
      if (search.trim() === "") {
        loadVehicles();
        return;
      }

      const token = localStorage.getItem("token");

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
      alert("Vehicle not found");
    }
  };

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

      alert("Vehicle Purchased");

      loadVehicles();
    } catch (error) {
      alert("Purchase Failed");
    }
  };

  const totalVehicles = vehicles.length;

  const totalStock = useMemo(() => {
    return vehicles.reduce((sum, v) => sum + v.quantity, 0);
  }, [vehicles]);

  const totalValue = useMemo(() => {
    return vehicles.reduce(
      (sum, v) => sum + v.price * v.quantity,
      0
    );
  }, [vehicles]);

  return (
    <div className="min-h-screen bg-slate-100">

      <div className="max-w-7xl mx-auto p-8">

        <h1 className="text-4xl font-bold text-slate-800 mb-8">
          Dashboard
        </h1>

        {/* Statistics */}

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-gray-500">
              Total Vehicles
            </h3>

            <p className="text-4xl font-bold text-blue-600 mt-3">
              {totalVehicles}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-gray-500">
              Total Stock
            </h3>

            <p className="text-4xl font-bold text-green-600 mt-3">
              {totalStock}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-gray-500">
              Inventory Value
            </h3>

            <p className="text-3xl font-bold text-purple-600 mt-3">
              ₹ {totalValue.toLocaleString()}
            </p>
          </div>

        </div>

        {/* Search */}

        <div className="bg-white rounded-xl shadow-lg p-5 mb-8 flex gap-3">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Make..."
            className="flex-1 border rounded-lg p-3"
          />

          <button
            onClick={searchVehicle}
            className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-lg"
          >
            Search
          </button>

          <button
            onClick={loadVehicles}
            className="bg-gray-700 hover:bg-gray-800 text-white px-6 rounded-lg"
          >
            Reset
          </button>

        </div>

        {/* Cards */}

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">

          {vehicles.map((vehicle) => (

            <div
              key={vehicle.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-6"
            >

              <div className="flex justify-between items-center mb-4">

                <h2 className="text-2xl font-bold">
                  {vehicle.make}
                </h2>

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {vehicle.category}
                </span>

              </div>

              <p className="text-gray-600 mb-3">
                {vehicle.model}
              </p>

              <div className="space-y-2 mb-5">

                <p>
                  <strong>Price:</strong> ₹ {vehicle.price.toLocaleString()}
                </p>

                <p>
                  <strong>Stock:</strong>

                  <span
                    className={`ml-2 font-bold ${
                      vehicle.quantity > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {vehicle.quantity}
                  </span>

                </p>

              </div>

              <button
                disabled={vehicle.quantity === 0}
                onClick={() => purchaseVehicle(vehicle.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold"
              >
                {vehicle.quantity > 0
                  ? "Purchase Vehicle"
                  : "Out of Stock"}
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}