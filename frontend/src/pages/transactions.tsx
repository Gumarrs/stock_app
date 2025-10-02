"use client";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import api from "@/utils/api";

interface Product {
  id: number;
  name: string;
  stock: number;
}

interface TransactionItem {
  id: number;
  qty: number;
  product: Product;
}

interface Transaction {
  id: number;
  type: "IN" | "OUT";
  note?: string;
  createdAt: string;
  items: TransactionItem[];
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // mode: "list" atau "form"
  const [mode, setMode] = useState<"list" | "form">("list");

  const [form, setForm] = useState({
    type: "IN" as "IN" | "OUT",
    note: "",
    items: [{ productId: 0, qty: 1 }],
  });

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
    setForm((prev) => ({
      ...prev,
      items: [{ productId: res.data[0]?.id || 0, qty: 1 }],
    }));
  };

  // --- form handler ---
  const handleAddRow = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { productId: products[0]?.id || 0, qty: 1 }],
    }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...form.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setForm({ ...form, items: newItems });
  };

  const handleRemoveRow = (index: number) => {
    const newItems = [...form.items];
    newItems.splice(index, 1);
    setForm({ ...form, items: newItems });
  };

  const handleSubmit = async () => {
    try {
      await api.post("/transactions", form);
      // reset
      setForm({
        type: "IN",
        note: "",
        items: [{ productId: products[0]?.id || 0, qty: 1 }],
      });
      setMode("list"); // balik ke list
      fetchTransactions();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error saving transaction");
    }
  };

  // --- UI ---
  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-700 dark:text-white">
          Transactions
        </h1>
        {mode === "list" ? (
          <button
            onClick={() => setMode("form")}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
          >
            + New Transaction
          </button>
        ) : (
          <button
            onClick={() => setMode("list")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </div>

      {mode === "list" ? (
        // ---------- History ----------
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Transaction History</h2>
          {loading ? (
            <p>Loading...</p>
          ) : transactions.length === 0 ? (
            <p>No transactions yet</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Date</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Note</th>
                  <th className="p-2">Items</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b">
                    <td className="p-2">
                      {new Date(t.createdAt).toLocaleString()}
                    </td>
                    <td
                      className={`p-2 font-bold ${
                        t.type === "IN" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {t.type}
                    </td>
                    <td className="p-2">{t.note || "-"}</td>
                    <td className="p-2">
                      <ul>
                        {t.items.map((it) => (
                          <li key={it.id}>
                            {it.product.name} — {it.qty}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        // ---------- Form ----------
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Add Transaction</h2>

          <div className="flex gap-3 mb-3">
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value as "IN" | "OUT" })
              }
              className="border rounded p-2 dark:bg-gray-700 dark:text-white"
            >
              <option value="IN">Stock In</option>
              <option value="OUT">Stock Out</option>
            </select>
            <input
              type="text"
              placeholder="Note (optional)"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="flex-1 border rounded p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <table className="w-full border-collapse mb-3">
            <thead>
              <tr className="border-b">
                <th className="p-2">Product</th>
                <th className="p-2">Qty</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {form.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-2">
                    <select
                      value={item.productId}
                      onChange={(e) =>
                        handleItemChange(idx, "productId", Number(e.target.value))
                      }
                      className="border rounded p-2 dark:bg-gray-700 dark:text-white"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (stock: {p.stock})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) =>
                        handleItemChange(idx, "qty", Number(e.target.value))
                      }
                      className="border rounded p-2 w-24 dark:bg-gray-700 dark:text-white"
                    />
                  </td>
                  <td className="p-2">
                    {form.items.length > 1 && (
                      <button
                        onClick={() => handleRemoveRow(idx)}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                      >
                        ✕
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleAddRow}
            className="px-3 py-1 bg-indigo-600 text-white rounded mr-2"
          >
            + Add Product
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-teal-600 text-white rounded"
          >
            Save Transaction
          </button>
        </div>
      )}
    </Layout>
  );
}
