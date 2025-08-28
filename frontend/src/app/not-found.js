"use client";
import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white text-center px-4">
      <FaExclamationTriangle className="text-6xl text-red-500 mb-4" />
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-slate-400 mb-6">Oops! The page you are looking for does not exist.This is just dummy display can be implemented later when needed.</p>
      <Link
        href="/"
        className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md text-sm font-semibold transition">
        Go Back Home
      </Link>
    </div>
  );
}
