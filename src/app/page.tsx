'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1b2838]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
              <span className="block text-gray-100">Game Distribution</span>
              <span className="block text-[#66c0f4]">Platform</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-[#acb2b8] sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Platform distribusi game digital untuk berbagi game dengan anggota keluarga anda
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link 
                  href="/store" 
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent 
                    text-base font-medium rounded-md text-white bg-[#1a9fff] hover:bg-[#66c0f4] 
                    transition-colors duration-200 md:py-4 md:text-lg md:px-10"
                >
                  Mulai Sekarang
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}