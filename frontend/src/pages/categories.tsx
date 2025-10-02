"use client";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import api from "@/utils/api";

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // Edit state
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create
  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await api.post("/categories", { name: newName, description: newDesc });
      setNewName("");
      setNewDesc("");
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      console.error("Error creating category", err);
    }
  };

  // Update
  const handleUpdate = async (id: number) => {
    try {
      await api.put(`/categories/${id}`, { name: editName, description: editDesc });
      setEditId(null);
      setEditName("");
      setEditDesc("");
      fetchCategories();
    } catch (err) {
      console.error("Error updating category", err);
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin mau hapus kategori ini?")) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category", err);
    }
  };

  // pagination logic
  const start = (page - 1) * limit;
  const paginatedData = categories.slice(start, start + limit);
  const totalPages = Math.ceil(categories.length / limit);

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-700 dark:text-white">
            Categories
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
          >
            + New Category
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-center">
                    No categories found
                  </td>
                </tr>
              ) : (
                paginatedData.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-2">{cat.id}</td>
                    <td className="px-4 py-2">
                      {editId === cat.id ? (
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="rounded-md border px-2 py-1 dark:bg-gray-800 dark:text-white"
                        />
                      ) : (
                        cat.name
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editId === cat.id ? (
                        <input
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="rounded-md border px-2 py-1 dark:bg-gray-800 dark:text-white"
                        />
                      ) : (
                        cat.description
                      )}
                    </td>
                    <td className="px-4 py-2 flex justify-end gap-2">
                      {editId === cat.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(cat.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditId(cat.id);
                              setEditName(cat.name);
                              setEditDesc(cat.description);
                            }}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500"
                          >
                            Delete
                          </button>
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
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">New Category</h2>
            <input
              type="text"
              placeholder="Category name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full mb-3 rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
            />
            <textarea
              placeholder="Description"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
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
