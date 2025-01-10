'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';

export default function Home() {
  useEffect(() => {
    // Declare global MUSICMATE_API_KEY
    if (typeof window !== 'undefined') {
      window.MUSICMATE_API_KEY = 'mk_kkxs08U_AxEsdKZjvbt0y5BGVvojBJLKfJf9h1IVh3c';
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#1b2838] relative">
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

        {/* Spotify Widget Container */}
        <style jsx>{`
          #spotify-widget {
            color: black !important;
          }
          #spotify-widget * {
            color: black !important;
          }
        `}</style>
        <div className="mt-12 flex justify-center">
          <div id="spotify-widget" className="w-full max-w-2xl bg-black rounded-lg overflow-hidden">
            {/* Widget will be injected here */}
          </div>
        </div>
      </main>

      {/* Scripts */}
      <Script
        id="spotify-widget-loader"
        src="https://spotify-bot.azurewebsites.net/static/js/widget-loader.js"
        strategy="afterInteractive"
      />
    </div>
  );
}