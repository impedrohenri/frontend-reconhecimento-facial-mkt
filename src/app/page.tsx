"use client";

import API_ADDRESS from "@/api/api.route";
import Header from "@/components/Header";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DashboardSummary {
  students_count: number;
  today_accesses: number;
  month_accesses: number;

  last_access: {
    student_id: number;
    recognized_at: string;
  } | null;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_ADDRESS}/dashboard/summary`
      );

      const data = await response.json();

      setSummary(data);
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

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-slate-100 p-8">
          Carregando dashboard...
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-100 p-6">

        <div className="mx-auto max-w-7xl">

          <div className="rounded-3xl bg-(--dark-blue) p-8 shadow-xl">

            <h1 className="text-4xl font-bold text-white">
              Dashboard
            </h1>

            <p className="mt-3 text-white/70">
              Visão geral do sistema de
              reconhecimento facial
            </p>

          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl bg-white p-6 shadow-lg">

              <p className="text-(--gray)">
                Alunos cadastrados
              </p>

              <h2 className="mt-3 text-5xl font-bold text-(--dark-blue)">
                {summary?.students_count ?? 0}
              </h2>

            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg">

              <p className="text-(--gray)">
                Reconhecimentos hoje
              </p>

              <h2 className="mt-3 text-5xl font-bold text-(--dark-blue)">
                {summary?.today_accesses ?? 0}
              </h2>

            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg">

              <p className="text-(--gray)">
                Reconhecimentos no mês
              </p>

              <h2 className="mt-3 text-5xl font-bold text-(--dark-blue)">
                {summary?.month_accesses ?? 0}
              </h2>

            </div>

          </div>


          <div className="mt-6 grid gap-6 lg:grid-cols-2">

            <div className="rounded-3xl bg-white p-8 shadow-lg">

              <h2 className="text-xl font-bold text-(--dark-blue)">
                Último acesso registrado
              </h2>

              {summary?.last_access ? (
                <div className="mt-6">

                  <p className="text-(--gray)">
                    ID do aluno
                  </p>

                  <h3 className="text-3xl font-bold text-(--dark-blue)">
                    #{summary.last_access.student_id}
                  </h3>

                  <p className="mt-4 text-sm text-(--gray)">
                    {formatDate(
                      summary.last_access
                        .recognized_at
                    )}
                  </p>

                </div>
              ) : (
                <p className="mt-4 text-(--gray)">
                  Nenhum acesso registrado.
                </p>
              )}

            </div>

            <div className="rounded-3xl bg-white p-8 shadow-lg">

              <h2 className="text-xl font-bold text-(--dark-blue)">
                Status do Sistema
              </h2>

              <div className="mt-6 flex items-center gap-3">

                <div className="h-4 w-4 rounded-full bg-green-500" />

                <span className="font-medium">
                  Online
                </span>

              </div>

              <p className="mt-4 text-sm text-(--gray)">
                Dashboard carregado com sucesso.
              </p>

            </div>

          </div>

          <div className="mt-6 rounded-3xl bg-white p-8 shadow-lg">

            <h2 className="mb-6 text-xl font-bold text-(--dark-blue)">
              Ações rápidas
            </h2>

            <div className="grid gap-4 md:grid-cols-3">

              <Link
                href="/students/register"
                className="
                  rounded-2xl
                  bg-(--light-blue)
                  p-5
                  text-center
                  font-semibold
                  text-(--dark-blue)
                  transition
                  hover:brightness-95
                "
              >
                Cadastrar Aluno
              </Link>

              <Link
                href="/historico"
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  p-5
                  text-center
                  font-semibold
                "
              >
                Histórico Geral
              </Link>

              <Link
                href="/reconhecimento?ip=192.168.1.XXX"
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  p-5
                  text-center
                  font-semibold
                "
              >
                Detector Facial
              </Link>

            </div>

          </div>

        </div>

      </main>
    </>
  );
}