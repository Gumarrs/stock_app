"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  EyeIcon,
  EyeSlashIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import api from "../utils/api";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Semua field wajib diisi.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password dan confirm password tidak sama.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        firstName,
        lastName,
        email,
        password,
      });

      setSuccess("Akun berhasil dibuat! Silakan login.");
      setTimeout(() => {
        router.push("/"); // redirect ke login setelah 2 detik
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registrasi gagal.");
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
      {/* Logo & Dark/Light toggle */}
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
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full border transition-colors duration-300 ${
            darkMode
              ? "bg-gray-700 border-gray-400 text-yellow-400 hover:bg-gray-600"
              : "bg-gray-200 border-gray-500 text-blue-600 hover:bg-gray-300"
          }`}
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Title */}
      <h2
        className={`text-center text-3xl font-extrabold tracking-tight ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Create an account
      </h2>

      {/* Form */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && (
          <div
            className={`p-3 rounded mb-6 text-sm ${
              darkMode ? "bg-red-900 text-red-400" : "bg-red-100 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className={`p-3 rounded mb-6 text-sm ${
              darkMode ? "bg-green-900 text-green-400" : "bg-green-100 text-green-700"
            }`}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={`mt-2 block w-full rounded-md px-3 py-2 sm:text-sm outline-1 focus:outline-2 focus:outline-indigo-600 ${
                darkMode
                  ? "bg-white/5 text-white outline-white/10 placeholder-gray-400 focus:outline-indigo-500"
                  : "bg-white text-gray-900 outline-gray-300 placeholder-gray-500"
              }`}
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={`mt-2 block w-full rounded-md px-3 py-2 sm:text-sm outline-1 focus:outline-2 focus:outline-indigo-600 ${
                darkMode
                  ? "bg-white/5 text-white outline-white/10 placeholder-gray-400 focus:outline-indigo-500"
                  : "bg-white text-gray-900 outline-gray-300 placeholder-gray-500"
              }`}
            />
          </div>

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

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirm-password"
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Confirm Password
            </label>
            <div className="mt-2 relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`block w-full rounded-md px-3 py-2 sm:text-sm outline-1 focus:outline-2 focus:outline-indigo-600 ${
                  darkMode
                    ? "bg-white/5 text-white outline-white/10 placeholder-gray-400 focus:outline-indigo-500"
                    : "bg-white text-gray-900 outline-gray-300 placeholder-gray-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute right-3 top-2 ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {showConfirmPassword ? (
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
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        {/* Link ke Login */}
        <p
          className={`mt-6 text-center text-sm ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Already have an account?{" "}
          <a
            href="/"
            className={`font-semibold ${
              darkMode
                ? "text-indigo-400 hover:text-indigo-300"
                : "text-indigo-600 hover:text-indigo-500"
            }`}
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
