"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  // Ensure the component is mounted before animations run
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Navbar />
      <div className=" flex flex-col items-center justify-center ">
        
        <div className={`max-w-2xl mx-auto px-4 py-16 sm:py-24 transition-all duration-700 ease-in-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center">
            <div className="bg-orange-500 inline-block rounded-full p-6 mb-8">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="white" 
                className="w-12 h-12"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" 
                />
              </svg>
            </div>
            <h1 className="text-6xl font-bold text-orange-600 mb-6">404</h1>
            <h2 className="text-3xl font-semibold text-teal-600 mb-3">Page Not Found</h2>
            <p className="text-lg text-gray-600 mb-8">
              Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/" 
                className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg shadow-md hover:bg-orange-600 transition-colors duration-300"
              >
                Return Home
              </Link>
              <button 
                onClick={() => window.history.back()} 
                className="px-6 py-3 bg-teal-500 text-white font-medium rounded-lg shadow-md hover:bg-teal-600 transition-colors duration-300"
              >
                Go Back
              </button>
            </div>
          </div>
          
          {/* Additional helpful links */}
          <div className="mt-16 border-t border-gray-200 pt-8">
            <h3 className="text-xl font-medium text-teal-600 mb-4 text-center">
              You might be looking for:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link 
                href="/programs" 
                className="p-4 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors duration-300 flex items-center"
              >
                <span className="text-orange-500 mr-2">→</span>
                <span className="text-gray-700">Explore Programs</span>
              </Link>
              <Link 
                href="/dashboard" 
                className="p-4 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors duration-300 flex items-center"
              >
                <span className="text-orange-500 mr-2">→</span>
                <span className="text-gray-700">Your Dashboard</span>
              </Link>
              <Link 
                href="/contact" 
                className="p-4 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors duration-300 flex items-center"
              >
                <span className="text-orange-500 mr-2">→</span>
                <span className="text-gray-700">Contact Us</span>
              </Link>
              <Link 
                href="/login" 
                className="p-4 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors duration-300 flex items-center"
              >
                <span className="text-orange-500 mr-2">→</span>
                <span className="text-gray-700">Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}