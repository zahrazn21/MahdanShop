// components/mobile/CustomBottomMenu.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  ShoppingBag, 
  Heart, 
  User, 
  ShoppingCart,
  Search,
  Menu,
  X,
  Plus
} from 'lucide-react';
import { useState } from 'react';

interface MenuItem {
  id: number;
  name: string;
  href?: string;
  icon: React.ElementType;
  action?: () => void;
  showBadge?: boolean;
}

export default function CustomBottomMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: 'خانه',
      href: '/',
      icon: Home,
    },
    {
      id: 2,
      name: 'محصولات',
      href: '/products',
      icon: ShoppingBag,
    },
    {
      id: 3,
      name: 'سبد خرید',
      href: '/cart',
      icon: ShoppingCart,
      showBadge: true,
    },
    {
      id: 4,
      name: 'علاقه‌مندی',
      href: '/wishlist',
      icon: Heart,
    },
    {
      id: 5,
      name: 'پروفایل',
      href: '/profile',
      icon: User,
    },
  ];

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === '/') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* فضای خالی */}
      <div className="h-16 lg:hidden" />
      
      {/* منوی اصلی */}
      <div dir='rtl' className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-pink-100 shadow-lg lg:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                href={item.href || '#'}
                className={`
                  relative flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-200
                  ${active 
                    ? 'text-pink-600' 
                    : 'text-gray-500 hover:text-pink-400'
                  }
                `}
              >
                <div className="relative">
                  <item.icon 
                    className={`w-5 h-5 transition-all duration-200 ${active ? 'scale-110' : ''}`}
                  />
                  
                  {/* {item.showBadge && itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[9px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )} */}
                </div>
                
                <span className={`text-[10px] font-medium ${active ? 'text-pink-600' : 'text-gray-500'}`}>
                  {item.name}
                </span>
                
                {active && (
                  <div className="absolute -top-2 w-6 h-1 bg-pink-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}