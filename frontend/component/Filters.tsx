"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function Filters() {
  const router = useRouter();
  const params = useSearchParams();

  const applyFilter = (key: string, value: string) => {
    const q = new URLSearchParams(params.toString());
    q.set(key, value);
    router.push(`/search?${q.toString()}`);
  };

  return (
    <div className="border p-4 rounded">
      <h3 className="font-medium mb-3">Filters</h3>

      <select onChange={(e) => applyFilter("category", e.target.value)}>
        <option value="">Category</option>
        <option value="kurti">Kurti</option>
        <option value="suit">Suit</option>
        <option value="lehenga">Lehenga</option>
      </select>

      <select
        className="mt-3"
        onChange={(e) => applyFilter("maxPrice", e.target.value)}
      >
        <option value="">Max Price</option>
        <option value="1000">₹1000</option>
        <option value="2000">₹2000</option>
        <option value="5000">₹5000</option>
      </select>
    </div>
  );
}
