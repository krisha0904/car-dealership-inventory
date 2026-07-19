import { useEffect, useState } from "react";
import api from "../services/api";

export default function Admin() {
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
      const token = localStorage.getItem("token");

      const response = await api.get("/vehicles", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setVehicles(response.data);
    } catch (error) {
      console.error(error);
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
      const token = localStorage.getItem("token");

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
    } catch (error) {
      console.error(error);
      alert("Unable to add vehicle");
    }
  };

  const updateVehicle = async () => {
    try {
      const token = localStorage.getItem("token");

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
    } catch (error) {
      console.error(error);
      alert("Unable to update vehicle");
    }
  };

  const deleteVehicle = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/vehicles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      loadVehicles();
    } catch (error) {
      console.error(error);
      alert("Unable to delete vehicle");
    }
  };

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Admin Panel
      </h1>

      <input
        className="border p-2 rounded w-full mb-3"
        placeholder="Make"
        name="make"
        value={vehicle.make}
        onChange={handleChange}
      />

      <input
        className="border p-2 rounded w-full mb-3"
        placeholder="Model"
        name="model"
        value={vehicle.model}
        onChange={handleChange}
      />

      <input
        className="border p-2 rounded w-full mb-3"
        placeholder="Category"
        name="category"
        value={vehicle.category}
        onChange={handleChange}
      />

      <input
        className="border p-2 rounded w-full mb-3"
        placeholder="Price"
        type="number"
        name="price"
        value={vehicle.price}
        onChange={handleChange}
      />

      <input
        className="border p-2 rounded w-full mb-3"
        placeholder="Quantity"
        type="number"
        name="quantity"
        value={vehicle.quantity}
        onChange={handleChange}
      />

      <button
        onClick={editingId ? updateVehicle : addVehicle}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        {editingId ? "Update Vehicle" : "Add Vehicle"}
      </button>

      {editingId && (
        <button
          onClick={clearForm}
          className="bg-gray-600 text-white px-6 py-2 rounded ml-3"
        >
          Cancel
        </button>
      )}

      <hr className="my-8" />

      <h2 className="text-2xl font-bold mb-4">
        Existing Vehicles
      </h2>

      {vehicles.length === 0 ? (
        <p>No vehicles available.</p>
      ) : (
        vehicles.map((v) => (
          <div
            key={v.id}
            className="border rounded p-4 mb-4 flex justify-between items-center shadow"
          >
            <div>
              <h3 className="text-lg font-bold">
                {v.make} {v.model}
              </h3>

              <p>Category: {v.category}</p>
              <p>Price: ₹{v.price}</p>
              <p>Stock: {v.quantity}</p>
            </div>

            <div>
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
                className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
              >
                Edit
              </button>

              <button
                onClick={() => deleteVehicle(v.id)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

    </div>
  );
}