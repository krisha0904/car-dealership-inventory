import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";

export default function Admin() {

  // Protect Admin Page
  if (!localStorage.getItem("admin_token")) {
    return <Navigate to="/admin" />;
  }

  const [vehicle, setVehicle] = useState({
    make: "",
    model: "",
    category: "",
    price: "",
    quantity: ""
  });

  const [vehicles, setVehicles] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const token = localStorage.getItem("admin_token");

      const response = await api.get("/vehicles", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setVehicles(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setVehicle({
      ...vehicle,
      [e.target.name]: e.target.value
    });
  };

  const clearForm = () => {
    setVehicle({
      make: "",
      model: "",
      category: "",
      price: "",
      quantity: ""
    });

    setEditingId(null);
  };

  const addVehicle = async () => {
    try {

      const token = localStorage.getItem("admin_token");

      await api.post(
        "/vehicles",
        {
          ...vehicle,
          price: Number(vehicle.price),
          quantity: Number(vehicle.quantity)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      clearForm();
      loadVehicles();

      alert("Vehicle Added Successfully");

    } catch (error) {
      console.log(error);
      alert("Unable to add vehicle");
    }
  };

  const updateVehicle = async () => {
    try {

      const token = localStorage.getItem("admin_token");

      await api.put(
        `/vehicles/${editingId}`,
        {
          ...vehicle,
          price: Number(vehicle.price),
          quantity: Number(vehicle.quantity)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      clearForm();
      loadVehicles();

      alert("Vehicle Updated Successfully");

    } catch (error) {
      console.log(error);
      alert("Unable to update vehicle");
    }
  };

  const deleteVehicle = async (id) => {
    try {

      const token = localStorage.getItem("admin_token");

      await api.delete(
        `/vehicles/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      loadVehicles();

      alert("Vehicle Deleted Successfully");

    } catch (error) {
      console.log(error);
      alert("Unable to delete vehicle");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold text-slate-800 mb-8">
          Admin Panel
        </h1>

        {/* Form */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">

          <h2 className="text-2xl font-bold mb-6">
            {editingId ? "Update Vehicle" : "Add New Vehicle"}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              name="make"
              placeholder="Make"
              value={vehicle.make}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              name="model"
              placeholder="Model"
              value={vehicle.model}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              name="category"
              placeholder="Category"
              value={vehicle.category}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={vehicle.price}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={vehicle.quantity}
              onChange={handleChange}
              className="border rounded-lg p-3"
            />

          </div>

          <div className="mt-6 flex gap-3">

            <button
              onClick={editingId ? updateVehicle : addVehicle}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              {editingId ? "Update Vehicle" : "Add Vehicle"}
            </button>

            {editingId && (
              <button
                onClick={clearForm}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
              >
                Cancel
              </button>
            )}

          </div>

        </div>

        {/* Vehicle Table */}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <div className="bg-slate-800 text-white p-5">

            <h2 className="text-2xl font-bold">
              Vehicle Inventory
            </h2>

          </div>

          <table className="w-full">

            <thead className="bg-gray-200">

              <tr>

                <th className="p-4 text-left">Make</th>
                <th className="p-4 text-left">Model</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Stock</th>
                <th className="p-4 text-center">Actions</th>

              </tr>

            </thead>

            <tbody>

              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-6">
                    No Vehicles Found
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => (
                  <tr
                    key={v.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4">{v.make}</td>
                    <td className="p-4">{v.model}</td>
                    <td className="p-4">{v.category}</td>
                    <td className="p-4">₹ {Number(v.price).toLocaleString()}</td>
                    <td className="p-4">{v.quantity}</td>

                    <td className="p-4 text-center">

                      <button
                        onClick={() => {
                          setVehicle({
                            make: v.make,
                            model: v.model,
                            category: v.category,
                            price: v.price,
                            quantity: v.quantity
                          });

                          setEditingId(v.id);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mr-2"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteVehicle(v.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}