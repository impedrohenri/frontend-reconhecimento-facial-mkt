"use client";

import API_ADDRESS from "@/api/api.route";
import Header from "@/components/Header";
import { useEffect, useRef, useState } from "react";
import Video from "./_components/Video";

export default function CadastroAlunoPage() {
  const [name, setName] = useState("");
  const [registration, setRegistration] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [age, setAge] = useState("");

  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    iniciarCamera();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream | null;

      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function iniciarCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error(err);
      setMessage(
        err.message || "Não foi possível acessar a câmera."
      );
    }
  }

  function tirarFoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const file = new File(
          [blob],
          `student-${Date.now()}.jpg`,
          {
            type: "image/jpeg",
          }
        );

        setPhoto(file);
        setPreview(URL.createObjectURL(blob));
      },
      "image/jpeg",
      0.95
    );
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (
      !name ||
      !registration ||
      !parentEmail ||
      !age ||
      !photo
    ) {
      setMessage(
        "Preencha todos os campos e capture uma foto."
      );
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();

      formData.append("name", name);
      formData.append("registration", registration);
      formData.append("parent_email", parentEmail);
      formData.append("age", age);
      formData.append("photo", photo);

      const response = await fetch(
        `${API_ADDRESS}/students`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Erro ao cadastrar aluno"
        );
      }

      setMessage("Aluno cadastrado com sucesso!");

      setName("");
      setRegistration("");
      setParentEmail("");
      setAge("");

      setPhoto(null);
      setPreview("");

    } catch (err: any) {
      setMessage(
        err.message || "Erro ao cadastrar aluno"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-6xl">

          <div className="overflow-hidden rounded-3xl bg-white shadow-xl">

            {/* Header */}
            <div className="bg-(--dark-blue) px-8 py-5">
              <h1 className="text-3xl font-bold text-white">
                Cadastro de Aluno
              </h1>

              <p className="mt-2 text-white/70">
                Registre um novo estudante no sistema
              </p>
            </div>

            {message && (
              <div className="mx-8 mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-md outline-(--light-blue) outline-2">
                {message}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="grid gap-8 p-8 lg:grid-cols-2"
            >

              {/* Coluna esquerda */}
              <div className="space-y-5">

                <div>
                  <label className="mb-2 block text-sm font-medium text-(--dark-blue)">
                    Nome completo
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Digite o nome do aluno"
                    className=" w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-(--light-blue) focus:ring-4 focus:ring-(--light-blue)/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-(--dark-blue)">
                    Matrícula
                  </label>

                  <input
                    type="text"
                    value={registration}
                    onChange={(e) =>
                      setRegistration(e.target.value)
                    }
                    placeholder="Número da matrícula"
                    className=" w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-(--light-blue) focus:ring-4 focus:ring-(--light-blue)/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-(--dark-blue)">
                    E-mail do responsável
                  </label>

                  <input
                    type="email"
                    value={parentEmail}
                    onChange={(e) =>
                      setParentEmail(e.target.value)
                    }
                    placeholder="responsavel@email.com"
                    className=" w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-(--light-blue) focus:ring-4 focus:ring-(--light-blue)/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-(--dark-blue)">
                    Idade
                  </label>

                  <input
                    type="number"
                    min={1}
                    value={age}
                    onChange={(e) =>
                      setAge(e.target.value)
                    }
                    placeholder="Idade do aluno"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-(--light-blue) focus:ring-4 focus:ring-(--light-blue)/20"
                  />
                </div>

              </div>

              {/* Coluna direita */}
              <div>
                <div
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <h2 className="mb-4 text-lg font-semibold text-(--dark-blue)">
                    Foto do Aluno
                  </h2>

                  <Video videoRef={videoRef as React.RefObject<HTMLVideoElement>} />

                  <button
                    type="button"
                    onClick={tirarFoto}
                    className=" mt-4 w-full rounded-xl bg-(--dark-blue) py-3 font-medium text-white transition hover:opacity-90"
                  >
                    Capturar Foto
                  </button>

                  {preview && (
                    <div className="mt-6">

                      <p className="mb-3 text-sm text-(--gray)">
                        Foto capturada
                      </p>

                      <img
                        src={preview}
                        alt="Prévia"
                        className="h-48 w-full rounded-xl border border-slate-200 object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="lg:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className=" w-full rounded-2xl bg-(--dark-blue) py-4 text-lg font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Cadastrando..."
                    : "Cadastrar Aluno"}
                </button>

                {message && (
              <div className="px-4 pt-4 text-center text-sm text-(--dark-blue)">
                {message}
              </div>
            )}
              </div>


            </form>

            <canvas
              ref={canvasRef}
              className="hidden"
            />
          </div>
        </div>
      </main>
    </>
  );
}