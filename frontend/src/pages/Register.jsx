import { useState } from "react";
import api from "../services/api";

export default function Register() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {

      await api.post("/auth/register", form);

      alert("Registration Successful!");

    } catch (err) {
      alert("Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white p-8 rounded shadow w-96">

        <h1 className="text-3xl font-bold mb-5">
          Register
        </h1>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="border w-full p-2 rounded mb-3"
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border w-full p-2 rounded mb-3"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="border w-full p-2 rounded mb-3"
        />

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white w-full p-2 rounded"
        >
          Register
        </button>

      </div>

    </div>
  );
}