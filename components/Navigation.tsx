'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, FileText, BarChart3, Settings, BookOpen } from 'lucide-react';

interface NavigationProps {
  role: 'assessments' | 'take-assessment';
}

export default function Navigation({ role }: NavigationProps) {
  const pathname = usePathname();

  const hrNavItems = [
    { href: '/assessments/assessments', label: 'Assessments', icon: FileText },
    { href: '/assessments/questions', label: 'Questions', icon: FileText },
    { href: '/assessments/candidates', label: 'Candidates', icon: Users },
  ];

  const candidateNavItems = [
    { href: '/candidate/dashboard', label: 'Dashboard', icon: Home },
    { href: '/assessment', label: 'Take Assessment', icon: BookOpen },
    { href: '/assessment/practice', label: 'Practice', icon: BookOpen },
    { href: '/candidate/results', label: 'Results', icon: BarChart3 },
  ];

  const navItems = role === 'assessments' ? hrNavItems : candidateNavItems;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-primary-600">
              AI Assessment
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 capitalize">
              {role === 'assessments' ? 'Assessments' : 'Take Assessment'}
            </span>
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Switch Role
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 