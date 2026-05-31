"use client";

import API_ADDRESS from "@/api/api.route";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Student {
  id: number;
  name: string;
  registration: string;
  parent_email: string;
  age: number;
}

interface AccessLog {
  id: number;
  confidence: number;
  recognized_at: string;
}

export default function StudentHistoryPage() {
  const params = useParams();

  const studentId = params.studentId;

  const [student, setStudent] =
    useState<Student | null>(null);

  const [logs, setLogs] =
    useState<AccessLog[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_ADDRESS}/students/${studentId}/access-logs`
      );

      const data = await response.json();

      if (!data?.length) return;

      setStudent(data[0].student);
      setLogs(data[0].logs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString(
      "pt-BR"
    );
  }

  const averageConfidence =
    logs?.length > 0
      ? (
          logs.reduce(
            (acc, log) =>
              acc + log.confidence,
            0
          ) / logs.length
        ) * 100
      : 0;

  const lastAccess =
    logs?.length > 0
      ? logs[0].recognized_at
      : null;

  if (loading) {
    return (
      <>
        <Header />
        <div className="p-10">
          Carregando...
        </div>
      </>
    );
  }

  if (!student) {
    return (
      <>
        <Header />
        <div className="p-10">
          Aluno não encontrado.
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-100 p-6">

        <div className="mx-auto max-w-7xl">

          {/* Header */}

          <div className="rounded-3xl bg-(--dark-blue) p-8 shadow-xl">

            <h1 className="text-4xl font-bold text-white">
              {student.name}
            </h1>

            <div className="mt-4 grid gap-2 text-white/80">

              <p>
                Matrícula:{" "}
                {student.registration}
              </p>

              <p>
                Responsável:{" "}
                {student.parent_email}
              </p>

              <p>
                Idade: {student.age} anos
              </p>

            </div>

          </div>

          {/* Estatísticas */}

          <div className="mt-6 grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl bg-white p-6 shadow-lg">

              <p className="text-(--gray)">
                Total de acessos
              </p>

              <h2 className="mt-2 text-4xl font-bold text-(--dark-blue)">
                {logs?.length}
              </h2>

            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg">

              <p className="text-(--gray)">
                Último acesso
              </p>

              <h2 className="mt-2 text-lg font-bold text-(--dark-blue)">
                {lastAccess
                  ? formatDate(lastAccess)
                  : "-"}
              </h2>

            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg">

              <p className="text-(--gray)">
                Confiança média
              </p>

              <h2 className="mt-2 text-4xl font-bold text-(--dark-blue)">
                {averageConfidence.toFixed(1)}%
              </h2>

            </div>

          </div>

          {/* Timeline */}

          <div className="mt-6 rounded-3xl bg-white p-8 shadow-lg">

            <h2 className="mb-8 text-2xl font-bold text-(--dark-blue)">
              Histórico de Reconhecimentos
            </h2>

            {logs?.length === 0 ? (
              <p className="text-(--gray)">
                Nenhum acesso registrado.
              </p>
            ) : (
              <div className="space-y-4">

                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-2xl
                      border
                      border-slate-200
                      p-5
                    "
                  >

                    <div>

                      <p className="font-medium text-(--dark-blue)">
                        Reconhecimento realizado
                      </p>

                      <p className="text-sm text-(--gray)">
                        {formatDate(
                          log.recognized_at
                        )}
                      </p>

                    </div>

                    <div
                      className="
                        rounded-full
                        bg-green-100
                        px-4
                        py-2
                        font-semibold
                        text-green-700
                      "
                    >
                      {(
                        log.confidence * 100
                      ).toFixed(1)}
                      %
                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

        </div>

      </main>
    </>
  );
}