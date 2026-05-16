"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function login(e: any) {

    e.preventDefault();

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      if (!response.ok) {

        toast.error(
          "Credenciales inválidas"
        );

        return;
      }

      const data = await response.json();

      localStorage.setItem(
        "samai-token",
        data.access_token
      );

      console.log(
        "TOKEN GUARDADO",
        data.access_token
      );

      toast.success(
        "Bienvenido al sistema"
      );

      window.location.href = "/admin";

    } catch {

      toast.error(
        "Error conectando con backend"
      );
    }
  }

  return (

    <main className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-[#111827] rounded-3xl shadow-2xl p-10 border border-gray-800">

        <div className="mb-8">

          <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
            S
          </div>

          <h1 className="text-4xl font-bold text-white mb-2">
            SAMAI STATUS
          </h1>

          <p className="text-gray-400">
            Acceso administrativo
          </p>

        </div>

        <form
          onSubmit={login}
          className="space-y-5"
        >

          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            className="w-full bg-[#1e293b] border border-gray-700 text-white rounded-xl p-4"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full bg-[#1e293b] border border-gray-700 text-white rounded-xl p-4"
          />

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-semibold"
          >
            Ingresar al sistema
          </button>

        </form>

      </div>

    </main>
  );
}