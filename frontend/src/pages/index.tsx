import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { EyeIcon, EyeSlashIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import api from "../utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  // Apply dark/light class to <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login gagal. Cek email/password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header: logo + toggle */}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm flex justify-between items-center mb-10">
        <div>
          <img
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
            className="mx-auto h-10 w-auto dark:hidden"
          />
          <img
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company"
            className="mx-auto h-10 w-auto hidden dark:block"
          />
        </div>

        {/* Dark/Light Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full border transition-colors duration-300 ${
            darkMode
              ? "bg-gray-700 border-gray-400 text-yellow-400 hover:bg-gray-600"
              : "bg-gray-200 border-gray-500 text-blue-600 hover:bg-gray-300"
          }`}
        >
          {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </button>
      </div>

      {/* Title */}
<h2
  className={`text-center text-3xl font-extrabold tracking-tight ${
    darkMode ? "text-white" : "text-gray-900"
  }`}
>
  Sign in to your account
</h2>


      {/* Form container */}
<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
  {/* Error Message */}
  {error && (
    <div
      className={`p-3 rounded mb-6 text-sm ${
        darkMode
          ? "bg-red-900 text-red-400"
          : "bg-red-100 text-red-700"
      }`}
    >
      {error}
    </div>
  )}

  {/* Form */}
  <form onSubmit={handleLogin} className="space-y-6">
    {/* Email */}
    <div>
      <label
        htmlFor="email"
        className={`block text-sm font-medium ${
          darkMode ? "text-gray-200" : "text-gray-700"
        }`}
      >
        Email address
      </label>
      <input
        id="email"
        type="email"
        name="email"
        autoComplete="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`mt-2 block w-full rounded-md px-3 py-2 sm:text-sm outline-1 focus:outline-2 focus:outline-indigo-600 ${
          darkMode
            ? "bg-white/5 text-white outline-white/10 placeholder-gray-400 focus:outline-indigo-500"
            : "bg-white text-gray-900 outline-gray-300 placeholder-gray-500"
        }`}
      />
    </div>

    {/* Password */}
    <div>
      <label
        htmlFor="password"
        className={`block text-sm font-medium ${
          darkMode ? "text-gray-200" : "text-gray-700"
        }`}
      >
        Password
      </label>
      <div className="mt-2 relative">
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          name="password"
          autoComplete="current-password"
          required
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`block w-full rounded-md px-3 py-2 sm:text-sm outline-1 focus:outline-2 focus:outline-indigo-600 ${
            darkMode
              ? "bg-white/5 text-white outline-white/10 placeholder-gray-400 focus:outline-indigo-500"
              : "bg-white text-gray-900 outline-gray-300 placeholder-gray-500"
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute right-3 top-2 ${
            darkMode
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>

    {/* Submit */}
    <div>
      <button
        type="submit"
        disabled={loading}
        className={`flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-md transition-colors ${
          darkMode
            ? "bg-indigo-500 text-white hover:bg-indigo-400 focus-visible:outline-indigo-500"
            : "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600"
        }`}
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </div>
  </form>

  {/* Register Link */}
  <p
    className={`mt-6 text-center text-sm ${
      darkMode ? "text-gray-400" : "text-gray-600"
    }`}
  >
    Don't have an account?{" "}
    <a
      href="/register"
      className={`font-semibold ${
        darkMode
          ? "text-indigo-400 hover:text-indigo-300"
          : "text-indigo-600 hover:text-indigo-500"
      }`}
    >
      Register
    </a>
  </p>
</div>

    </div>
  );
}
