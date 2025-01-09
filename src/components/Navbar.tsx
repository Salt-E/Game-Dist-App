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
    { href: '/store', label: 'Store', Icon: ShoppingCart },
    { href: '/library', label: 'Library', Icon: Library },
    { href: '/family', label: 'Family Sharing', Icon: Users },
  ];

  return (
    <nav className="bg-secondary border-b border-border w-full fixed top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-xl font-bold mr-8 text-primary hover:text-primary/90 transition-colors"
            >
              FamGames
            </Link>
            
            <div className="flex items-center space-x-6">
              {navLinks.map(({ href, label, Icon }) => (
                <Link 
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors
                    ${pathname === href 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                    }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User size={18} />
                  <span className="text-sm">{user.email}</span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => logout()}
                  className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button 
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}