// components/layout/breadcrumb.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon, HomeIcon } from '@radix-ui/react-icons';

export default function Breadcrumb() {
  const pathname = usePathname();
  
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    
    return [
      { name: 'Home', href: '/' },
      ...paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        return {
          name: path.charAt(0).toUpperCase() + path.slice(1),
          href
        };
      })
    ];
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            {index === 0 ? (
              <HomeIcon className="h-4 w-4 mr-2" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 mr-2" />
            )}
            
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-gray-900">{breadcrumb.name}</span>
            ) : (
              <Link 
                href={breadcrumb.href} 
                className="hover:text-gray-900"
              >
                {breadcrumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
