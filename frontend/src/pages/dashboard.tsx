"use client";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Product {
  id: number;
  name: string;
  stock: number;
  category: { id: number; name: string };
}

interface TransactionItem {
  qty: number;
  product: Product;
}

interface Transaction {
  id: number;
  type: "IN" | "OUT";
  createdAt: string;
  items: TransactionItem[];
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [prodRes, transRes] = await Promise.all([
          api.get("/products"),
          api.get("/transactions"),
        ]);

        setProducts(prodRes.data);
        setTransactions(transRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  // 📊 Data 1: Produk per kategori
  const categoryCounts: Record<string, number> = {};
  products.forEach((p) => {
    const cat = p.category?.name || "Uncategorized";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  const categoryChartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Products",
        data: Object.values(categoryCounts),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  // 📊 Data 2: Transaksi IN vs OUT (kuantitas per produk)
  const productTotals: Record<string, { in: number; out: number }> = {};
  transactions.forEach((t) => {
    t.items.forEach((it) => {
      const name = it.product.name;
      if (!productTotals[name]) {
        productTotals[name] = { in: 0, out: 0 };
      }
      if (t.type === "IN") {
        productTotals[name].in += it.qty;
      } else {
        productTotals[name].out += it.qty;
      }
    });
  });
  const labels = Object.keys(productTotals);
  const inData = labels.map((name) => productTotals[name].in);
  const outData = labels.map((name) => productTotals[name].out);

  const barChartData = {
    labels,
    datasets: [
      {
        label: "Stock In",
        data: inData,
        backgroundColor: "rgba(34,197,94,0.7)", // green
      },
      {
        label: "Stock Out",
        data: outData,
        backgroundColor: "rgba(239,68,68,0.7)", // red
      },
    ],
  };

  // 📊 Data 3: Transaksi 15hari yang lalu
const lastdays = Array.from({ length: 15 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (10 - i)); // mundur 14 hari sampai hari ini
  return d.toISOString().split("T")[0];
});

  const dailyCounts: Record<string, number> = {};
  lastdays.forEach((d) => (dailyCounts[d] = 0));
  transactions.forEach((t) => {
    const day = t.createdAt.split("T")[0];
    if (dailyCounts[day] !== undefined) dailyCounts[day]++;
  });
  const lineChartData = {
    labels: lastdays,
    datasets: [
      {
        label: "Transactions",
        data: Object.values(dailyCounts),
        fill: false,
        borderColor: "#6366f1",
        tension: 0.3,
      },
    ],
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-700 dark:text-white mb-6">
        Dashboard Overview
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6 flex flex-col items-center justify-center">
          <h2 className="text-gray-500 dark:text-gray-300 text-sm">
            Total Products
          </h2>
          <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
            {products.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6 flex flex-col items-center justify-center">
          <h2 className="text-gray-500 dark:text-gray-300 text-sm">
            Total Categories
          </h2>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2">
            {Object.keys(categoryCounts).length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6 flex flex-col items-center justify-center">
          <h2 className="text-gray-500 dark:text-gray-300 text-sm">
            Total Transactions
          </h2>
          <p className="text-4xl font-bold text-orange-600 dark:text-orange-400 mt-2">
            {transactions.length}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produk per kategori */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-sm font-semibold mb-3">Products per Category</h2>
          <Bar data={categoryChartData} />
        </div>

        {/* Stock In vs Out per produk */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-sm font-semibold mb-3">Stock In vs Out (per Product)</h2>
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              plugins: { legend: { position: "bottom" } },
            }}
          />
        </div>

        {/* Transaksi per 7 hari */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow lg:col-span-2">
          <h2 className="text-sm font-semibold mb-3">Transactions (Last 7 Days)</h2>
          <Line data={lineChartData} />
        </div>
      </div>
    </Layout>
  );
}
