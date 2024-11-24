import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg dark:bg-gray-900">
      <div className="max-wx-auto px-4 sm:px-6 lg:px-8">
       <div className="flex justify-between h-16">
         <div className="flex items-center">
           <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white">
             GameDist
           </Link>
         </div>
         <div className="flex items-center space-x-4">
           <Link href="/api-docs" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
             API Docs
           </Link>
           <Link href="/auth" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
             Login
           </Link>
         </div>
       </div>
     </div>
   </nav>
 );
}