import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


export default function Login() {

    const navigate = useNavigate();

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const handleLogin = async()=>{

        try{

            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );


            localStorage.setItem(
                "token",
                response.data.access_token
            );


            alert("Login Successful");

            navigate("/dashboard");


        }catch(error){

            alert(
                "Invalid email or password"
            );

        }

    };


    return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">


        <div className="bg-white p-8 rounded-lg shadow-lg w-96">


            <h1 className="text-3xl font-bold mb-6 text-center">
                Login
            </h1>


            <input
            className="border w-full p-2 rounded mb-4"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />


            <input
            className="border w-full p-2 rounded mb-4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />


            <button
            onClick={handleLogin}
            className="bg-blue-600 text-white w-full p-2 rounded"
            >
                Login
            </button>


        </div>


    </div>

    );
}