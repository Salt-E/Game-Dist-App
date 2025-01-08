// 'use client';
   import Link from 'next/link';
// import Navbar from './components/navbar';

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <Navbar />
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="py-20">
//           <div className="text-center">
//             <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
//               <span className="block">Game Distribution</span>
//               <span className="block text-blue-600">Platform</span>
//             </h1>
//             <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
//               Platform distribusi game digital untuk berbagi game dengan anggota keluarga anda
//             </p>
//             <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
//               <div className="rounded-md shadow">
                // <Link href="/auth" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                //   Mulai Sekarang
                // </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
// app/page.tsx
import { GameCard } from "@/components/GameCard";
import { SearchBar } from "@/components/SearchBar";

export default function StorePage() {
  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Game Store</h1>
        <SearchBar />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Game cards will be rendered here */}
      </div>
    </div>
  );
}