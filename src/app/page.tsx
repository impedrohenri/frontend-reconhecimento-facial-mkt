"use client";

import API_ADDRESS from "@/api/api.route";
import { useEffect, useRef, useState } from "react";

export default function CadastroAlunoPage() {
  const [nome, setNome] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    iniciarCamera();
  }, []);

  async function iniciarCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setMessage("Não foi possível acessar a câmera.");
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

    canvas.toBlob((blob) => {
      if (!blob) return;

      const arquivo = new File([blob], "foto.jpg", {
        type: "image/jpeg",
      });

      setFile(arquivo);
      setPreview(URL.createObjectURL(blob));
    }, "image/jpeg", 0.95);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nome || !file) {
      setMessage("Informe nome e tire a foto.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("file", file);

      const res = await fetch(API_ADDRESS + "/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Erro");

      setMessage("Aluno cadastrado com sucesso!");
      setNome("");
      setFile(null);
      setPreview("");

    } catch (err: any) {
      setMessage(err.message || "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 space-y-6">

        <h1 className="text-3xl font-bold">Cadastrar Aluno</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do aluno"
            className="w-full border rounded-xl px-4 py-3"
          />

          <div className="space-y-3">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-xl border"
            />

            <button
              type="button"
              onClick={tirarFoto}
              className="w-full bg-blue-600 text-white rounded-xl py-3"
            >
              Tirar Foto
            </button>
          </div>

          {preview && (
            <img
              src={preview}
              className="w-full rounded-xl border"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-xl py-3"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>

        </form>

        {message && (
          <div className="bg-slate-100 rounded-xl p-4 text-sm">
            {message}
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </main>
  );
}