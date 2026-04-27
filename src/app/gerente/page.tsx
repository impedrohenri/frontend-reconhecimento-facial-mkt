"use client";

import WS_ADDRESS from "@/api/ws.route";
import { useEffect, useState } from "react";

type Evento = {
  tipo: "aprovado" | "negado";
  nome: string;
  hora: string;
};

export default function GerentePage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [status, setStatus] = useState("Conectando...");

  useEffect(() => {
    const ws = new WebSocket(WS_ADDRESS + "/ws");

    ws.onopen = () => {
      setStatus("Online");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setEventos((prev) => [data, ...prev]);
    };

    ws.onclose = () => {
      setStatus("Offline");
    };

    ws.onerror = () => {
      setStatus("Erro");
    };

    ws.onerror = (e) => {
  console.log("erro websocket", e);
};

ws.onclose = (e) => {
  console.log("fechou", e);
};

    return () => ws.close();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Painel do Gerente</h1>
            <p className="text-slate-500">
              Entradas em tempo real
            </p>
          </div>

          <div className="text-sm font-semibold">
            Status: {status}
          </div>
        </div>

        <div className="grid gap-4">

          {eventos.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-500">
              Nenhum evento ainda
            </div>
          )}

          {eventos.map((item, index) => (
            <div
              key={index}
              className={`rounded-2xl p-5 shadow text-white ${
                item.tipo === "aprovado"
                  ? "bg-green-600"
                  : "bg-red-600"
              }`}
            >
              <div className="text-xl font-bold">
                {item.tipo === "aprovado"
                  ? "Acesso Liberado"
                  : "Acesso Negado"}
              </div>

              <div className="mt-2 text-lg">
                {item.nome}
              </div>

              <div className="text-sm opacity-90 mt-1">
                {item.hora}
              </div>
            </div>
          ))}

        </div>
      </div>
    </main>
  );
}