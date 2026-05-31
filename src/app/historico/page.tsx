"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import API_ADDRESS from "@/api/api.route";
import { useRouter } from "next/navigation";

interface AccessLog {
  id: number;
  confidence: number;
  recognized_at: string;

  student: {
    id: number;
    name: string;
    registration: string;
  };
}

export default function AccessLogsPage() {
  const router = useRouter();

  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs(filterDate?: string) {
    try {
      setLoading(true);

      let url = `${API_ADDRESS}/access-logs`;

      if (filterDate) {
        url += `?date=${filterDate}`;
      }

      const response = await fetch(url);

      const data = await response.json();

      setLogs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString("pt-BR");
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-100 p-6">

        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="rounded-3xl bg-(--dark-blue) p-8 shadow-xl">

            <h1 className="text-3xl font-bold text-white">
              Histórico de Acessos
            </h1>

            <p className="mt-2 text-white/70">
              Todos os reconhecimentos registrados pelo sistema
            </p>

          </div>

          {/* Filtros */}
          <div className="mt-6 rounded-3xl bg-white p-6 shadow-lg">

            <div className="flex flex-col gap-4 md:flex-row">

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                className="
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  py-3
                "
              />

              <button
                onClick={() => loadLogs(date)}
                className="
                  rounded-xl
                  bg-(--dark-blue)
                  px-6
                  py-3
                  text-white
                "
              >
                Filtrar
              </button>

              <button
                onClick={() => {
                  setDate("");
                  loadLogs();
                }}
                className="
                  rounded-xl
                  border
                  border-slate-300
                  px-6
                  py-3
                "
              >
                Limpar
              </button>

            </div>

          </div>

          {/* Tabela */}
          <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-lg">

            <div className="border-b p-6">

              <h2 className="font-semibold text-(--dark-blue)">
                Registros encontrados
              </h2>

              <p className="text-sm text-(--gray)">
                {logs.length} acessos registrados
              </p>

            </div>

            {loading ? (
              <div className="p-8 text-center">
                Carregando...
              </div>
            ) : logs.length === 0 ? (
              <div className="p-8 text-center">
                Nenhum registro encontrado
              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>

                    <tr className="bg-slate-50">

                      <th className="px-6 py-4 text-left">
                        Aluno
                      </th>

                      <th className="px-6 py-4 text-left">
                        Matrícula
                      </th>

                      <th className="px-6 py-4 text-left">
                        Confiança
                      </th>

                      <th className="px-6 py-4 text-left">
                        Reconhecido em
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {logs.map((log) => (
                      <tr
                        key={log.id}
                        onClick={() =>
                          router.push(
                            `/students/${log.student.id}/access-logs`
                          )
                        }
                        className="
                          cursor-pointer
                          border-t
                          transition
                          hover:bg-slate-50
                        "
                      >
                        <td className="px-6 py-4 font-medium">
                          {log.student.name}
                        </td>

                        <td className="px-6 py-4">
                          {log.student.registration}
                        </td>

                        <td className="px-6 py-4">

                          <span
                            className="
                              rounded-full
                              bg-green-100
                              px-3
                              py-1
                              text-sm
                              font-medium
                              text-green-700
                            "
                          >
                            {(log.confidence * 100).toFixed(1)}%
                          </span>

                        </td>

                        <td className="px-6 py-4">
                          {formatDate(
                            log.recognized_at
                          )}
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>

      </main>
    </>
  );
}