"use client";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import api from "@/utils/api";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price?: number;
  stock?: number;
  categoryId: number;
  category?: Category;
  imageUrl?: string;
  createdAt?: string; // untuk sorting newest/oldest
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(6);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState<Partial<Product>>({
    id: 0,
    name: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: 0,
    imageUrl: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Filters & sorting
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<number | "">("");
  const [sortBy, setSortBy] = useState("newest");

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const openModal = (product?: Product) => {
    if (product) {
      setForm({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price ?? 0,
        stock: product.stock ?? 0,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl || "",
      });
      if (product.imageUrl) {
        const previewUrl = `${process.env.NEXT_PUBLIC_API}${product.imageUrl}`;
        setImagePreview(previewUrl);
      } else {
        setImagePreview(null);
      }
      setImageFile(null);
      setIsEditing(true);
    } else {
      setForm({
        id: 0,
        name: "",
        description: "",
        price: 0,
        stock: 0,
        categoryId: categories[0]?.id || 0,
        imageUrl: "",
      });
      setImageFile(null);
      setImagePreview(null);
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("name", form.name || "");
        formData.append("description", form.description || "");
        formData.append("price", String(form.price || 0));
        formData.append("stock", String(form.stock || 0));
        formData.append("categoryId", String(form.categoryId || 0));
        formData.append("image", imageFile);

        if (isEditing) {
          await api.put(`/products/${form.id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          await api.post("/products", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      } else {
        const payload = {
          name: form.name,
          description: form.description,
          price: form.price || 0,
          stock: form.stock || 0,
          categoryId: form.categoryId,
          imageUrl: form.imageUrl,
        };

        if (isEditing) {
          await api.put(`/products/${form.id}`, payload);
        } else {
          await api.post("/products", payload);
        }
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error("Error saving product", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin mau hapus produk ini?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  // filtering + sorting
  const filteredProducts = products
    .filter((p) =>
      search ? p.name.toLowerCase().includes(search.toLowerCase()) : true
    )
    .filter((p) => (filterCategory ? p.categoryId === filterCategory : true))
    .sort((a, b) => {
      if (sortBy === "newest") {
        return (b.createdAt ? new Date(b.createdAt).getTime() : 0) -
               (a.createdAt ? new Date(a.createdAt).getTime() : 0);
      }
      if (sortBy === "oldest") {
        return (a.createdAt ? new Date(a.createdAt).getTime() : 0) -
               (b.createdAt ? new Date(b.createdAt).getTime() : 0);
      }
      if (sortBy === "stock-high") return (b.stock || 0) - (a.stock || 0);
      if (sortBy === "stock-low") return (a.stock || 0) - (b.stock || 0);
      return 0;
    });

  // pagination
  const start = (page - 1) * limit;
  const paginatedData = filteredProducts.slice(start, start + limit);
  const totalPages = Math.ceil(filteredProducts.length / limit);

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-700 dark:text-white">
            Products
          </h1>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
          >
            + New Product
          </button>
        </div>

        {/* Controls: Search + Filter + Sort */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
          />

          <select
            value={filterCategory}
            onChange={(e) =>
              setFilterCategory(e.target.value ? Number(e.target.value) : "")
            }
            className="rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="stock-high">Highest Stock</option>
            <option value="stock-low">Lowes Stock</option>
          </select>
        </div>

        {/* Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {loading ? (
    <p>Loading...</p>
  ) : paginatedData.length === 0 ? (
    <p>No products found</p>
  ) : (
    paginatedData.map((p) => (
      <div
        key={p.id}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col group"
      >
        {/* Image */}
<div className="aspect-square w-full rounded-xl overflow-hidden bg-gray-700 dark:bg-gray-100 mb-3">
  {p.imageUrl ? (
    <img
      src={`${process.env.NEXT_PUBLIC_API}${p.imageUrl}`}
      alt={p.name}
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
  ) : (
    <span className="flex items-center justify-center h-full text-gray-500 dark:text-gray-300 text-sm">
      No Image
    </span>
  )}
</div>


        {/* Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
            {p.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {p.description}
          </p>
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
              {categories.find((c) => c.id === p.categoryId)?.name || "-"}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-300">
              Stock:{" "}
              <span className="font-medium">{p.stock ?? "N/A"}</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={() => openModal(p)}
            className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(p.id)}
            className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm transition"
          >
            Delete
          </button>
        </div>
      </div>
    ))
  )}
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
            <h2 className="text-lg font-bold mb-4">
              {isEditing ? "Edit Product" : "New Product"}
            </h2>

            <input
              type="text"
              placeholder="Product name"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mb-3 rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
            />
            <textarea
              placeholder="Description"
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full mb-3 rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="number"
              placeholder="Enter stock"
              value={form.stock ?? ""}
              onChange={(e) =>
                setForm({ ...form, stock: e.target.value ? Number(e.target.value) : 0 })
              }
              className="w-full mb-3 rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
            />

            {/* Upload gambar */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setImageFile(file);
                  setImagePreview(file ? URL.createObjectURL(file) : null);
                }}
                className="w-full mb-3 rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
              />

              {imagePreview && (
                <div className="mb-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-40 object-contain rounded bg-gray-100"
                  />
                </div>
              )}
            </div>

            <select
              value={form.categoryId || ""}
              onChange={(e) =>
                setForm({ ...form, categoryId: Number(e.target.value) })
              }
              className="w-full mb-3 rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
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
