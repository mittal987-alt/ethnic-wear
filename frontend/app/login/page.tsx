"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const { setUser } = useAuth();

  const handleLogin = async () => {
    try {
      const { data } = await API.post("/auth/login", {
        email,
        password,
      });

      // ✅ JWT METHOD → SAVE TOKEN
      localStorage.setItem("token", data.token);

      // ✅ set user
      setUser(data.user);

      router.push("/");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <main className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>

      <input
        className="w-full border px-4 py-2 mb-4 rounded"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full border px-4 py-2 mb-6 rounded"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="w-full bg-black text-white py-3 rounded"
      >
        Login
      </button>
    </main>
  );
}
