'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, ClipboardList, TrendingUp, Settings } from 'lucide-react';

const navItems = [
  {
    name: '首页',
    href: '/',
    icon: Home,
  },
  {
    name: '记录',
    href: '/record',
    icon: ClipboardList,
  },
  {
    name: '统计',
    href: '/statistics',
    icon: TrendingUp,
  },
  {
    name: '设置',
    href: '/settings',
    icon: Settings,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-8">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold">康复助手</span>
          </Link>
        </div>
        <div className="flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-2 transition-colors hover:text-foreground/80',
                  isActive
                    ? 'text-foreground'
                    : 'text-foreground/60'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
