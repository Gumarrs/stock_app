"use client";
import { useEffect, useState } from "react";
import {
  MoonIcon,
  SunIcon,
  Bars3Icon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import api from "../utils/api";

interface NavbarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function Navbar({ sidebarOpen, onToggleSidebar }: NavbarProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  // theme toggle
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // preload profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/admins/profile/me");
        setProfile(res.data);
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
        setEmail(res.data.email);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await api.put("/admins/profile/me", {
        firstName,
        lastName,
        email,
         dob: profile?.dob || null,       // <-- tambahkan ini
      gender: profile?.gender || null, 
      });
      if (newPassword && oldPassword) {
        await api.put("/admins/profile/me/password", {
          oldPassword,
          newPassword,
        });
      }
      setMessage("Profil berhasil diperbarui!");
      setTimeout(() => setSettingsModalOpen(false), 1500);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Gagal update profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 h-14 flex items-center justify-between px-4 bg-white border-b shadow-sm dark:bg-gray-900 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {!sidebarOpen && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          )}
          <h1 className="hidden md:block text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
            Deptech Dashboard
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 relative">
          {/* Dark/Light toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full border text-gray-600 dark:text-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <UserCircleIcon className="h-7 w-7 text-gray-600 dark:text-gray-200" />
              <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-200">
                {profile ? `${profile.firstName} ${profile.lastName}` : "Loading..."}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border rounded-md shadow-lg overflow-hidden">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setSettingsModalOpen(true);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setLogoutModalOpen(true);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Modal */}
      {logoutModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-3 dark:text-white">
              Konfirmasi Logout
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Yakin mau keluar dari akun ini?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setLogoutModalOpen(false)}
                className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded bg-red-600 text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {settingsModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4 dark:text-white">
              Update Profile
            </h2>
            {message && (
              <p className="mb-2 text-sm text-green-600 dark:text-green-400">
                {message}
              </p>
            )}
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm dark:text-gray-200">
                  Nama Depan
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full mt-1 p-2 rounded border dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm dark:text-gray-200">
                  Nama Belakang
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full mt-1 p-2 rounded border dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm dark:text-gray-200">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 p-2 rounded border dark:bg-gray-700 dark:text-white"
                />
              </div>
                {/* New: Date of Birth */}
  <div>
    <label className="block text-sm dark:text-gray-200">
      Tanggal Lahir
    </label>
    <input
      type="date"
      value={profile?.dob || ""}
      onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
      className="w-full mt-1 p-2 rounded border dark:bg-gray-700 dark:text-white"
    />
  </div>

  {/* New: Gender */}
  <div>
    <label className="block text-sm dark:text-gray-200">
      Jenis Kelamin
    </label>
    <select
      value={profile?.gender || ""}
      onChange={(e) =>
        setProfile({ ...profile, gender: e.target.value as "M" | "F" })
      }
      className="w-full mt-1 p-2 rounded border dark:bg-gray-700 dark:text-white"
    >
      <option value="">Pilih</option>
      <option value="M">Laki-laki</option>
      <option value="F">Perempuan</option>
    </select>
  </div>


              {/* Change password */}
              <div className="border-t pt-3">
                <h3 className="text-sm font-semibold mb-2 dark:text-gray-200">
                  Change Password
                </h3>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full mt-1 p-2 rounded border dark:bg-gray-700 dark:text-white"
                  placeholder="Old Password"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full mt-2 p-2 rounded border dark:bg-gray-700 dark:text-white"
                  placeholder="New Password"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setSettingsModalOpen(false)}
                  className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-3 py-1 rounded bg-indigo-600 text-white"
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
