"use client";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "🏠 Dashboard" },
  { href: "/categories", label: "📂 Categories" },
  { href: "/products", label: "📦 Products" },
  { href: "/transactions", label: "💸 Transactions" },
  { href: "/admins", label: "👨‍💼 Admins" },
];

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 inset-y-0 left-0 w-60 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-200 
        bg-white dark:bg-gray-900 border-r dark:border-gray-700 flex flex-col`}
      >
        {/* Header with Logo (desktop) + Close (mobile) */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            DEPTECH
          </span>
          <button
            className="md:hidden text-gray-600 dark:text-gray-300"
            onClick={() => setOpen(false)}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-md font-medium transition ${
                pathname === link.href
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => setOpen(false)} // auto close on click
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
