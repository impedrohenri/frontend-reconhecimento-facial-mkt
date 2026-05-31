"use client";

import API_ADDRESS from "@/api/api.route";
import { useEffect, useRef, useState } from "react";

export default function DetectorPortaria() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    startCamera();
  }, []);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1920, height: 1200, frameRate: 30 },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.log(error);
      setPermissionDenied(true);
    }
  }

  async function handleDetect() {
    try {
      if (!videoRef.current || !canvasRef.current) return;

      setLoading(true);
      setResult(null);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob: Blob = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b as Blob), "image/jpeg", 0.7)
      );

      const previewUrl = URL.createObjectURL(blob);
      setPreview(previewUrl);

      const form = new FormData();
      form.append("photo", blob, "face.jpg");

      const response = await fetch(`${API_ADDRESS}/recognize`, {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.log(error);
      alert("Falha ao verificar rosto");
    } finally {
      setLoading(false);
    }
  }

  if (permissionDenied) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Permita acesso à câmera no navegador.
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-white flex items-center justify-center">

      {/* Camera */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="
        absolute
        h-full
        w-full
        sm:h-auto
        sm:w-auto
        rounded-xl
        object-cover
        scale-x-[-1]
      "
      />

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Conteúdo */}
      <div className="relative z-10 flex h-full flex-col justify-between p-6">

        {/* Header */}
        <div className="pt-8 text-center">

          <h1 className="text-4xl font-bold text-white">
            Controle de Acesso
          </h1>

          <p className="mt-3 text-white/80">
            Centralize o rosto na moldura
          </p>

        </div>

        {/* Área central */}
        <div className="flex flex-1 items-center justify-center">

          <div className="relative">

            {/* Moldura */}
            <div
              className="
              h-[320px]
              w-[240px]
              rounded-[999px]
              border-4
              border-(--light-blue)
              shadow-[0_0_40px_rgba(30,251,250,0.5)]
            "
            />

            {/* Texto */}
            <div
              className="
              absolute
              left-1/2
              top-full
              mt-5
              -translate-x-1/2
              rounded-full
              bg-black/60
              px-4
              py-2
              text-sm
              text-white
              w-max
            "
            >
              Posicione o rosto dentro da área
            </div>

          </div>

        </div>

        {/* Botão */}
        <button
          onClick={handleDetect}
          disabled={loading}
          className="
          mx-auto
          mb-8
          w-full
          max-w-md
          rounded-2xl
          bg-(--light-blue)
          py-4
          text-lg
          font-bold
          text-(--dark-blue)
          transition
          hover:brightness-95
          disabled:opacity-50
        "
        >
          {loading
            ? "Verificando..."
            : "Verificar Identidade"}
        </button>

      </div>

      {/* Resultado */}
      {result && (
        <div
          className="
          absolute
          left-1/2
          top-8
          z-30
          w-[90%]
          max-w-lg
          -translate-x-1/2
          rounded-3xl
          border
          border-white/10
          bg-zinc-900/95
          p-6
          backdrop-blur
        "
        >
          {result.match ? (
            <>
              <div className="mb-2 text-3xl font-bold text-green-400">
                ✓ Acesso Liberado
              </div>

              <div className="space-y-1 text-white">
                <p>
                  <strong>Aluno:</strong> {result.student.name}
                </p>

                {result.registration && (
                  <p>
                    <strong>Matrícula:</strong>{" "}
                    {result.registration}
                  </p>
                )}

                {result.similarity && (
                  <p>
                    <strong>Similaridade:</strong>{" "}
                    {(result.similarity * 100).toFixed(2)}%
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="mb-2 text-2xl font-bold text-red-400">
                ✕ Não Reconhecido
              </div>

              <p className="text-white/80">
                {result.error || "Nenhum aluno correspondente foi encontrado."}
              </p>
            </>
          )}
        </div>
      )}

      {/* Preview */}
      {preview && (
        <img
          src={preview}
          alt="Captura"
          className="
          absolute
          bottom-6
          right-6
          z-20
          h-28
          w-20
          rounded-xl
          border-2
          border-white/30
          object-cover
          shadow-lg
        "
        />
      )}

      <canvas
        ref={canvasRef}
        className="hidden"
      />
    </div>
  );
}