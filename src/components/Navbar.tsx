// components/Navbar.tsx
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Library, Users, User, LogOut } from "lucide-react";
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from "./ui/button";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navLinks = [
    { href: '/', label: 'Store', Icon: ShoppingCart },
    { href: '/library', label: 'Library', Icon: Library },
    { href: '/family', label: 'Family', Icon: Users },
  ];

  return (
    <nav className="border-b w-full fixed top-0 bg-white z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold mr-8">
              GameStore
            </Link>
            
            <div className="flex items-center space-x-8">
              {navLinks.map(({ href, label, Icon }) => (
                <Link 
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 transition-colors
                    ${pathname === href ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <User size={20} />
                  <span className="text-sm">{user.email}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logout()}
                  className="flex items-center gap-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
