"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const { setUser } = useAuth();

  const handleRegister = async () => {
    try {
      const { data } = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      setUser(data.user);

      router.push("/");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Create Account
      </h1>

      <input
        className="w-full border px-4 py-2 mb-4 rounded"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

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
        onClick={handleRegister}
        className="w-full bg-black text-white py-3 rounded"
      >
        Register
      </button>

      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Login
        </span>
      </p>
    </main>
  );
}
