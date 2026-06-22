"use client"

import * as React from "react"
import { XIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react"

interface LightboxModalProps {
  src: string
  alt?: string
  onClose: () => void
}

function LightboxModal({ src, alt = "", onClose }: LightboxModalProps) {
  const [scale, setScale] = React.useState(1)

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
          className="rounded-full bg-white/10 hover:bg-white/20 text-white p-2 transition-colors"
        >
          <ZoomOutIcon className="size-4" />
        </button>
        <button
          onClick={() => setScale((s) => Math.min(4, s + 0.25))}
          className="rounded-full bg-white/10 hover:bg-white/20 text-white p-2 transition-colors"
        >
          <ZoomInIcon className="size-4" />
        </button>
        <button
          onClick={onClose}
          className="rounded-full bg-white/10 hover:bg-white/20 text-white p-2 transition-colors"
        >
          <XIcon className="size-4" />
        </button>
      </div>

      {/* Image */}
      <div
        className="flex items-center justify-center max-w-[90vw] max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          style={{ transform: `scale(${scale})`, transition: "transform 0.2s ease" }}
          className="max-w-[85vw] max-h-[85vh] object-contain rounded-lg shadow-2xl select-none"
          draggable={false}
        />
      </div>

      {/* Caption */}
      {alt && (
        <div className="absolute bottom-6 left-0 right-0 text-center text-white/70 text-sm px-4">
          {alt}
        </div>
      )}
    </div>
  )
}

interface ImageLightboxProps {
  src: string
  alt?: string
  children: React.ReactNode
  className?: string
}

export function ImageLightbox({ src, alt = "", children, className }: ImageLightboxProps) {
  const [open, setOpen] = React.useState(false)

  if (!src) return <>{children}</>

  return (
    <>
      <span
        className={`cursor-zoom-in ${className ?? "contents"}`}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true) }}
      >
        {children}
      </span>
      {open && <LightboxModal src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  )
}
