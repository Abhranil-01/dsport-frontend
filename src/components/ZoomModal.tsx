"use client";
import Image from "next/image";
import { useState } from "react";

export default function ImageZoomModal({
  images,
  index,
  onClose,
}: {
  images: any[];
  index: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* CLOSE */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl"
      >
        ✕
      </button>

      {/* IMAGE */}
      <div className="relative w-full h-full max-w-4xl max-h-[90vh]">
        <Image
          src={images[current].url}
          alt="zoom"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* NAV */}
      {current > 0 && (
        <button
          onClick={() => setCurrent((p) => p - 1)}
          className="absolute left-4 text-white text-4xl"
        >
          ‹
        </button>
      )}

      {current < images.length - 1 && (
        <button
          onClick={() => setCurrent((p) => p + 1)}
          className="absolute right-4 text-white text-4xl"
        >
          ›
        </button>
      )}
    </div>
  );
}
