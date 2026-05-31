import React from 'react'

export default function Video({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement> }) {
  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className=" aspect-4/3 w-full rounded-xl bg-black object-cover scale-x-[-1]"
      />

      <div
        className=" pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className=" h-56 w-44 rounded-[999px] border-4 border-(--light-blue) shadow-[0_0_25px_rgba(30,251,250,0.4)]"
        />
      </div>

      <div
        className=" pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-xs text-white"
      >
        Centralize o rosto dentro da moldura
      </div>
    </div>
  )
}
