"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { setUser } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const { data } = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      setUser(data.user);

      toast.success("Welcome back 🎉");

      setTimeout(() => router.push("/"), 1200);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100 px-4">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl max-w-5xl w-full flex overflow-hidden"
        >

          {/* LEFT BRAND */}
          <div className="hidden md:flex w-1/2 bg-gradient-to-br from-rose-200 to-pink-300 items-center justify-center p-12">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-black rounded-2xl p-10 shadow-xl"
            >
              <img
                src="/logo.png"
                alt="Brand"
                className="w-52"
              />
            </motion.div>
          </div>

          {/* RIGHT FORM */}
          <div className="w-full md:w-1/2 p-10 sm:p-14">

            <h1 className="text-3xl font-bold text-gray-900">
              Welcome Back 👋
            </h1>
            <p className="text-gray-500 mb-8">
              Login to continue shopping
            </p>

            <div className="space-y-5">

              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-300 outline-none transition"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-300 outline-none transition"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-xl font-medium hover:opacity-90 transition"
              >
                {loading ? "Logging in..." : "Login"}
              </motion.button>

            </div>

            <p className="text-sm text-center mt-6 text-gray-600">
              Don’t have an account?{" "}
              <span
                onClick={() => router.push("/register")}
                className="text-pink-600 font-semibold cursor-pointer hover:underline"
              >
                Register
              </span>
            </p>

          </div>
        </motion.div>
      </div>
    </>
  );
}
