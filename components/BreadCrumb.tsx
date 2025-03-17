import {  usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

type BreadcrumbProps = {
  userRole: string;
};

const Breadcrumb = ({ userRole }: BreadcrumbProps) => {

  const pathname = usePathname();
  
  // Define routes based on user role
  const routes = {
    STARTUP: {
      base: '/dashboard',
      paths: {
        '/dashboard': 'Dashboard',
        '/dashboard/forum': 'Forum',
        '/dashboard/profile': 'Profile',
        '/dashboard/application': 'Application',
        '/dashboard/mentors': 'Mentors',
        '/dashboard/investors': 'Investors',
      },
    },
    ADMIN: {
      base: '/dashboard/admin',
      paths: {
        '/dashboard/admin': 'Dashboard',
        '/dashboard/admin/forum': 'Forum',
        '/dashboard/admin/application': 'Application',
        '/dashboard/admin/users': 'Users',
        '/dashboard/admin/programs': 'Programs',
        '/dashboard/admin/analytics': 'Analytics',
      },
    },
  };

  // Determine which set of routes to use
  const currentRoutes = userRole === 'ADMIN' ? routes.ADMIN : routes.STARTUP;
  
  // Build breadcrumb items
  const buildBreadcrumb = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    let currentPath = '';
    
    // Start with home
    const breadcrumbItems = [
      {
        label: userRole === 'ADMIN' ? 'Admin' : 'Startup',
        path: userRole === 'ADMIN' ? '/dashboard/admin' : '/dashboard',
        active: pathname === (userRole === 'ADMIN' ? '/dashboard/admin' : '/dashboard'),
      },
    ];
    
    // Add path segments
    for (let i = 0; i < pathSegments.length; i++) {
      currentPath += `/${pathSegments[i]}`;
      
      // Skip the first segment for admin since it's already added
      if (userRole === 'ADMIN' && i === 0 && pathSegments[i] === 'dashboard') {
        continue;
      }
      
      // Skip the second segment for admin if it's "admin" (already included in first item)
      if (userRole === 'ADMIN' && i === 1 && pathSegments[i] === 'admin') {
        continue;
      }
      
      // For startup, skip the first segment if it's "dashboard" (already in first item)
      if (userRole === 'STARTUP' && i === 0 && pathSegments[i] === 'dashboard') {
        continue;
      }
      
      // Look up the path in our defined routes
      if (currentRoutes.paths[currentPath as keyof typeof currentRoutes.paths]) {
        breadcrumbItems.push({
          label: currentRoutes.paths[currentPath as keyof typeof currentRoutes.paths],
          path: currentPath,
          active: pathname === currentPath,
        });
      }
    }
    
    return breadcrumbItems;
  };
  
  const breadcrumbItems = buildBreadcrumb();
  
  return (
    <nav aria-label="breadcrumb" className="mb-4 px-4 py-2 bg-white rounded-md shadow-sm">
      <ol className="flex items-center space-x-2 text-sm">
        <li className="flex items-center">
          <Link href={currentRoutes.base} className="text-gray-500 hover:text-blue-600 flex items-center">
            <Home size={16} className="mr-1" />
            <span>{userRole === 'ADMIN' ? 'Admin' : 'Startup'}</span>
          </Link>
        </li>
        
        {breadcrumbItems.slice(1).map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight size={14} className="text-gray-400 mx-1" />
            {item.active ? (
              <span className="font-medium text-blue-600">{item.label}</span>
            ) : (
              <Link href={item.path} className="text-gray-500 hover:text-blue-600">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;