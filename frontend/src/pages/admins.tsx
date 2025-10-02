"use client";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import api from "@/utils/api";

interface Admin {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dob?: string;
  gender?: "M" | "F";
  canDelete?: boolean;
}

export default function AdminPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState<Partial<Admin & { password: string }>>({});

  // Edit state
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Admin & { password?: string }>>({});

  const [currentUserId, setCurrentUserId] = useState(0);

useEffect(() => {
  const id = parseInt(localStorage.getItem("userId") || "0", 10);
  setCurrentUserId(id);
}, []);

  const fetchAdmins = async () => {
    try {
      const res = await api.get("/admins");
      setAdmins(
        res.data.map((a: Admin) => ({
          ...a,
          canDelete: a.id !== currentUserId,
        }))
      );
    } catch (err) {
      console.error("Error fetching admins", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Create
    const handleCreate = async () => {
        try {
        await api.post("/admins", {
            firstName: newAdmin.firstName,
            lastName: newAdmin.lastName,
            email: newAdmin.email,
            password: newAdmin.password,
            dob: newAdmin.dob || null,
            gender: newAdmin.gender || null,
        });
        setNewAdmin({});
        setShowModal(false);
        fetchAdmins();
        } catch (err) {
        console.error("Error creating admin", err);
        }
    };

    // Update
    const handleUpdate = async (id: number) => {
        try {
        await api.put(`/admins/${id}`, {
            firstName: editData.firstName,
            lastName: editData.lastName,
            email: editData.email,
            dob: editData.dob || null,
            gender: editData.gender || null,
        });
        setEditId(null);
        setEditData({});
        fetchAdmins();
        } catch (err) {
        console.error("Error updating admin", err);
        }
    };

  // Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin mau hapus admin ini?")) return;
    try {
      await api.delete(`/admins/${id}`);
      fetchAdmins();
    } catch (err) {
      console.error("Error deleting admin", err);
    }
  };

// pagination logic
const start = (page - 1) * limit;
const filteredAdmins = admins.filter((a) => a.id !== currentUserId); // exclude current user
const paginatedData = filteredAdmins.slice(start, start + limit);
const totalPages = Math.ceil(filteredAdmins.length / limit);

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-700 dark:text-white">
            Admin Management
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
          >
            + New Admin
          </button>
        </div>

        {/* Table */}
<div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-lg">
  <table className="min-w-full text-xs sm:text-sm">
    <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
      <tr>
        <th className="px-2 py-1 sm:px-4 sm:py-2 text-left">ID</th>
        <th className="px-2 py-1 sm:px-4 sm:py-2 text-left">Nama Depan</th>
        <th className="px-2 py-1 sm:px-4 sm:py-2 text-left">Nama Belakang</th>
        <th className="px-2 py-1 sm:px-4 sm:py-2 text-left">Email</th>
        <th className="px-2 py-1 sm:px-4 sm:py-2 text-left">Tanggal Lahir</th>
        <th className="px-2 py-1 sm:px-4 sm:py-2 text-left">Jenis Kelamin</th>
        <th className="px-2 py-1 sm:px-4 sm:py-2 text-right">Actions</th>
      </tr>
    </thead>
    <tbody>
      {loading ? (
        <tr>
          <td colSpan={7} className="px-2 py-1 sm:px-4 sm:py-2 text-center">
            Loading...
          </td>
        </tr>
      ) : paginatedData.length === 0 ? (
        <tr>
          <td colSpan={7} className="px-2 py-1 sm:px-4 sm:py-2 text-center">
            No admins found
          </td>
        </tr>
      ) : (
        paginatedData.map((admin) => (
          <tr
            key={admin.id}
            className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <td className="px-2 py-1 sm:px-4 sm:py-2">{admin.id}</td>
            <td className="px-2 py-1 sm:px-4 sm:py-2">{editId === admin.id ? (
              <input
                value={editData.firstName || ""}
                onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                className="rounded-md border px-2 py-1 dark:bg-gray-800 dark:text-white w-full"
              />
            ) : admin.firstName}</td>
            <td className="px-2 py-1 sm:px-4 sm:py-2">{editId === admin.id ? (
              <input
                value={editData.lastName || ""}
                onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                className="rounded-md border px-2 py-1 dark:bg-gray-800 dark:text-white w-full"
              />
            ) : admin.lastName}</td>
            <td className="px-2 py-1 sm:px-4 sm:py-2">{editId === admin.id ? (
              <input
                type="email"
                value={editData.email || ""}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="rounded-md border px-2 py-1 dark:bg-gray-800 dark:text-white w-full"
              />
            ) : admin.email}</td>
            <td className="px-2 py-1 sm:px-4 sm:py-2">{editId === admin.id ? (
              <input
                type="date"
                value={editData.dob || ""}
                onChange={(e) => setEditData({ ...editData, dob: e.target.value })}
                className="rounded-md border px-2 py-1 dark:bg-gray-800 dark:text-white w-full"
              />
            ) : admin.dob || "-"}</td>
            <td className="px-2 py-1 sm:px-4 sm:py-2">{editId === admin.id ? (
              <select
                value={editData.gender || ""}
                onChange={(e) =>
                  setEditData({ ...editData, gender: e.target.value as 'M' | 'F' })
                }
                className="rounded-md border px-2 py-1 dark:bg-gray-800 dark:text-white w-full"
              >
                <option value="">Pilih</option>
                <option value="M">Laki-laki</option>
                <option value="F">Perempuan</option>
              </select>
            ) : admin.gender === "M" ? "Laki-laki" : admin.gender === "F" ? "Perempuan" : "-"}</td>
            <td className="px-2 py-1 sm:px-4 sm:py-2 flex flex-wrap justify-end gap-1 sm:gap-2">
              {editId === admin.id ? (
                <>
                  <button
                    onClick={() => handleUpdate(admin.id)}
                    className="px-2 py-1 sm:px-3 sm:py-1 bg-green-600 text-white rounded hover:bg-green-500"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-500 text-white rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditId(admin.id);
                      setEditData(admin);
                    }}
                    className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
                  >
                    Edit
                  </button>
                  {admin.canDelete && (
                    <button
                      onClick={() => handleDelete(admin.id)}
                      className="px-2 py-1 sm:px-3 sm:py-1 bg-red-600 text-white rounded hover:bg-red-500"
                    >
                      Delete
                    </button>
                  )}
                </>
              )}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

{/* Pagination */}
{totalPages > 1 && (
  <div className="flex flex-wrap justify-end gap-2 mt-4">
    <button
      onClick={() => setPage((p) => Math.max(1, p - 1))}
      disabled={page === 1}
      className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
    >
      Prev
    </button>
    <span className="px-2 py-1 sm:px-3 sm:py-1">
      Page {page} of {totalPages}
    </span>
    <button
      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
      disabled={page === totalPages}
      className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}

      </div>

      {/* Modal Create Admin */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">New Admin</h2>

            <input
              type="text"
              placeholder="Nama Depan"
              value={newAdmin.firstName || ""}
              onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
              className="w-full mb-3 rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              placeholder="Nama Belakang"
              value={newAdmin.lastName || ""}
              onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
              className="w-full mb-3 rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="email"
              placeholder="Email"
              value={newAdmin.email || ""}
              onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
              className="w-full mb-3 rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="date"
              value={newAdmin.dob || ""}
              onChange={(e) => setNewAdmin({ ...newAdmin, dob: e.target.value })}
              className="w-full mb-3 rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
            />
            <select
              value={newAdmin.gender || ""}
              onChange={(e) => setNewAdmin({ ...newAdmin, gender: e.target.value as 'M' | 'F',})}
              className="w-full mb-3 rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="M">Laki-laki</option>
              <option value="F">Perempuan</option>
            </select>
            <input
              type="password"
              placeholder="Password"
              value={newAdmin.password || ""}
              onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              className="w-full mb-3 rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
