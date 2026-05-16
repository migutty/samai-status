"use client";

import toast from "react-hot-toast";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {

  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("HIGH");
  const [workaround, setWorkaround] = useState("");

  const [incidents, setIncidents] = useState<any[]>([]);

  const [updateMessage, setUpdateMessage] = useState("");

  async function fetchIncidents() {

    const token = localStorage.getItem(
      "samai-token"
    );

    if (!token) {

      router.push("/login");
      return;
    }

    const response = await fetch(
      "https://samai-status-production.up.railway.app/incidents/"
    );

    const incidentsData = await response.json();

    const incidentsWithUpdates = await Promise.all(

      incidentsData.map(async (incident: any) => {

        const updatesResponse = await fetch(
          `https://samai-status-production.up.railway.app/incidents/${incident.id}/updates`
        );

        const updates = await updatesResponse.json();

        return {
          ...incident,
          updates,
        };
      })
    );

    setIncidents(incidentsWithUpdates);
  }

  useEffect(() => {

    fetchIncidents();

    const interval = setInterval(() => {
      fetchIncidents();
    }, 5000);

    return () => clearInterval(interval);

  }, []);

  async function createIncident(e: any) {

    e.preventDefault();

    const token = localStorage.getItem(
      "samai-token"
    );

    const response = await fetch(
      "https://samai-status-production.up.railway.app/incidents/",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          title,
          incident_type: "SYSTEM",
          description,
          severity,
          status: "IN_PROGRESS",
          workaround,
        }),
      }
    );

    if (response.ok) {

      toast.success(
        "Incidente creado correctamente"
      );

      setTitle("");
      setDescription("");
      setSeverity("HIGH");
      setWorkaround("");

      fetchIncidents();
    }
  }

  async function resolveIncident(id: string) {

    const token = localStorage.getItem(
      "samai-token"
    );

    const response = await fetch(
      `https://samai-status-production.up.railway.app/incidents/${id}/resolve`,
      {
        method: "PUT",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {

      toast.success(
        "Incidente resuelto"
      );
    }

    fetchIncidents();
  }

  async function createUpdate(id: string) {

    if (!updateMessage) return;

    const token = localStorage.getItem(
      "samai-token"
    );

    const response = await fetch(
      `https://samai-status-production.up.railway.app/incidents/${id}/updates`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          update_type: "PROGRESS",
          message: updateMessage,
        }),
      }
    );

    if (response.ok) {

      toast.success(
        "Seguimiento actualizado"
      );
    }

    setUpdateMessage("");

    fetchIncidents();
  }

  const activeIncidents = incidents.filter(
    (incident: any) =>
      incident.status !== "RESOLVED"
  );

  const resolvedIncidents = incidents.filter(
    (incident: any) =>
      incident.status === "RESOLVED"
  );

  const severityData = [
    {
      name: "HIGH",
      value: incidents.filter(
        (i: any) => i.severity === "HIGH"
      ).length,
    },
    {
      name: "MEDIUM",
      value: incidents.filter(
        (i: any) => i.severity === "MEDIUM"
      ).length,
    },
    {
      name: "LOW",
      value: incidents.filter(
        (i: any) => i.severity === "LOW"
      ).length,
    },
  ];

  const statusData = [
    {
      name: "Activos",
      total: activeIncidents.length,
    },
    {
      name: "Resueltos",
      total: resolvedIncidents.length,
    },
  ];

  return (

    <main className="min-h-screen bg-[#0f172a] p-8 text-white">

      <div className="max-w-5xl mx-auto space-y-10">

        <div className="flex justify-end">

          <button
            onClick={() => {

              localStorage.removeItem(
                "samai-token"
              );

              router.push("/login");
            }}
            className="bg-red-500 text-white shadow-lg px-5 py-3 rounded-xl font-semibold hover:bg-red-700"
          >
            Cerrar sesión
          </button>

        </div>

        <div className="bg-[#111827] rounded-2xl shadow-md p-8">

          <h1 className="text-3xl font-bold mb-2">
            Panel Operativo SAMAI
          </h1>

          <p className="text-gray-400 mb-8">
            Administración de incidentes judiciales
          </p>

          <form
            onSubmit={createIncident}
            className="space-y-6"
          >

            <input
              type="text"
              placeholder="Título"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full border border-gray-700 bg-[#1e293b] text-white rounded-xl p-3"
            />

            <textarea
              placeholder="Descripción"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full border border-gray-700 bg-[#1e293b] text-white rounded-xl p-3 h-28"
            />

            <select
              value={severity}
              onChange={(e) =>
                setSeverity(e.target.value)
              }
              className="w-full border border-gray-700 bg-[#1e293b] text-white rounded-xl p-3"
            >
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>

            <textarea
              placeholder="Contingencia operativa"
              value={workaround}
              onChange={(e) =>
                setWorkaround(e.target.value)
              }
              className="w-full border border-gray-700 bg-[#1e293b] text-white rounded-xl p-3 h-24"
            />

            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Crear incidente
            </button>

          </form>

        </div>

      <div className="space-y-6">

  {incidents.map((incident: any) => (

    <div
      key={incident.id}
      className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-lg"
    >

      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-2xl font-bold">
            {incident.title}
          </h2>

          <p className="text-gray-400 mt-2">
            {incident.description}
          </p>

        </div>

        <div>

          <span
            className={`px-4 py-2 rounded-xl text-sm font-bold ${
              incident.severity === "HIGH"
                ? "bg-red-600"
                : incident.severity === "MEDIUM"
                ? "bg-yellow-500 text-black"
                : "bg-blue-500"
            }`}
          >
            {incident.severity}
          </span>

        </div>

      </div>

      <div className="mt-5 space-y-2 text-sm">

        <p>
          <span className="text-gray-400">
            Estado:
          </span>{" "}
          {incident.status}
        </p>

        <p>
          <span className="text-gray-400">
            ETA:
          </span>{" "}
          {incident.estimated_resolution || "No definido"}
        </p>

        <p>
          <span className="text-gray-400">
            Contingencia:
          </span>{" "}
          {incident.workaround || "N/A"}
        </p>

      </div>

      <div className="flex gap-3 mt-6">

        <button
          onClick={() =>
            resolveIncident(incident.id)
          }
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl font-semibold"
        >
          Resolver
        </button>

      </div>

    </div>
  ))}
</div>
      
      </div>

    </main>
  );
}