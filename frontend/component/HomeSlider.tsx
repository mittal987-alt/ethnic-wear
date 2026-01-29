"use client";
import { useState } from "react";

const slides = [
  "/banner1.jpg",
  "/banner2.jpg",
  "/banner3.jpg",
];

export default function HomeSlider() {
  const [index, setIndex] = useState(0);

  return (
    <div className="relative h-[420px] overflow-hidden">
      <img src={slides[index]}  className="w-full h-48 sm:h-56 object-cover rounded" />
      <button
        onClick={() => setIndex((index + 1) % slides.length)}
        className="absolute right-5 top-1/2 bg-white px-3 py-2 rounded"
      >
        →
      </button>
    </div>
  );
}
