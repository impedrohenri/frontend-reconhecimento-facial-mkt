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
        video: { facingMode: "user" },
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
      form.append("file", blob, "face.jpg");

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
    <div className="relative h-screen bg-black overflow-hidden">
      {/* CAMERA */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
      />

      {/* Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6">
        <div className="text-center mt-8">
          <h1 className="text-white text-3xl font-bold">Portaria</h1>
          <p className="text-gray-300 mt-2">
            Alinhe o rosto e pressione verificar
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-[250px] h-[320px] border-4 border-green-500 rounded-3xl" />
        </div>

        <button
          onClick={handleDetect}
          disabled={loading}
          className="mb-8 bg-green-500 text-black font-bold py-4 rounded-2xl text-xl"
        >
          {loading ? "Verificando..." : "Verificar"}
        </button>
      </div>

      {/* Resultado */}
      {result && (
        <div className="absolute bottom-28 left-5 right-5 bg-zinc-900 p-5 rounded-2xl z-20">
          {result.match ? (
            <>
              <h2 className="text-green-500 text-2xl font-bold">
                Acesso Liberado
              </h2>
              <p className="text-white mt-2">Aluno: {result.nome}</p>
            </>
          ) : (
            <h2 className="text-red-500 text-2xl font-bold">
              Não reconhecido
            </h2>
          )}
        </div>
      )}

      {/* Preview */}
      {preview && (
        <img
          src={preview}
          className="absolute top-5 right-5 w-[70px] h-[90px] rounded-xl object-cover z-20"
        />
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}