"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfileModal = () => setShowProfileModal(!showProfileModal);

  return (
    <nav className="bg-white/40 backdrop-blur-md border-b z-50 sticky top-0 border-gray-200 shadow-lg shadow-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="text-2xl font-bold text-gray-800">
            <Link href="/">Whispr</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
              Dashboard
            </Link>
            <Link href="/schedule" className="text-gray-700 hover:text-blue-600 font-medium">
              My Schedule
            </Link>
            <Link href="/teams" className="text-gray-700 hover:text-blue-600 font-medium">
              Teams
            </Link>
            <Link href="/calendar" className="text-gray-700 hover:text-blue-600 font-medium">
              Calendar
            </Link>
          </div>

          {/* Profile Button + Mobile Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleProfileModal}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <User className="w-6 h-6 text-gray-700" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded hover:bg-gray-100"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3 space-y-2">
          <Link href="/dashboard" className="block text-gray-700 hover:text-blue-600 font-medium">
            Dashboard
          </Link>
          <Link href="/schedule" className="block text-gray-700 hover:text-blue-600 font-medium">
            My Schedule
          </Link>
          <Link href="/teams" className="block text-gray-700 hover:text-blue-600 font-medium">
            Teams
          </Link>
          <Link href="/calendar" className="block text-gray-700 hover:text-blue-600 font-medium">
            Calendar
          </Link>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Welcome!</h2>
            <p className="text-gray-600 mb-4">Please sign in or create an account:</p>
            <div className="flex flex-col space-y-3">
              <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Sign In
              </button>
              <button className="bg-gray-100 text-gray-800 py-2 rounded hover:bg-gray-200">
                Sign Up
              </button>
            </div>
            <button
              onClick={toggleProfileModal}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
