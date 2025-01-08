// import Link from 'next/link';
// import { useRouter } from 'next/router';

// export default function Navbar() {
//   return (
//     <nav className="bg-white shadow-lg dark:bg-gray-900">
//       <div className="max-wx-auto px-4 sm:px-6 lg:px-8">
//        <div className="flex justify-between h-16">
//          <div className="flex items-center">
//            <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white">
//              GameDist
//            </Link>
//          </div>
//          <div className="flex items-center space-x-4">
//            <Link href="/api-docs" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
//              API Docs
//            </Link>
          //  <Link href="/auth" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          //    Login
          //  </Link>
//          </div>
//        </div>
//      </div>
//    </nav>
//  );
// }
'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Library, Users, User } from "lucide-react";
import { useAuth } from '@/lib/hooks/useAuth';

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  return (
    <nav className="border-b w-full fixed top-0 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">
          <Link href="/" className="text-xl font-bold mr-8">
            GameStore
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link 
              href="/"
              className={`flex items-center gap-2 ${pathname === '/' ? 'text-primary' : ''}`}
            >
              <ShoppingCart size={20} />
              <span>Store</span>
            </Link>
            
            <Link 
              href="/library"
              className={`flex items-center gap-2 ${pathname === '/library' ? 'text-primary' : ''}`}
            >
              <Library size={20} />
              <span>Library</span>
            </Link>
            
            <Link 
              href="/family"
              className={`flex items-center gap-2 ${pathname === '/family' ? 'text-primary' : ''}`}
            >
              <Users size={20} />
              <span>Family</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <User size={20} />
            <span>{user?.email}</span>
          </div>
          <div className="ml-auto">
            <Link 
              href="/auth" 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Login
            </Link>
            
          </div>
        </div>
      </div>
    </nav>
  );
}