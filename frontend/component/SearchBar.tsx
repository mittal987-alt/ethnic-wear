"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    if (!keyword.trim()) return;
    router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="flex items-center border rounded-full px-4 py-3 shadow-sm">
      <input
        type="text"
        placeholder="Search kurtis, suits, lehengas..."
        className="flex-1 outline-none text-sm"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />

      <button
        onClick={handleSearch}
        className="text-rose-600 font-medium"
      >
        Search
      </button>
    </div>
  );
}