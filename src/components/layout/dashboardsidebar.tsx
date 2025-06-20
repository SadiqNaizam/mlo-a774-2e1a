import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Cpu, Database, Network, Settings as SettingsIcon, PlusCircle, LayoutDashboard } from 'lucide-react';

interface DashboardSidebarProps {
  className?: string;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ className }) => {
  console.log('DashboardSidebar loaded');

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
      isActive ? 'bg-muted text-primary font-medium' : 'text-muted-foreground'
    }`;

  const serviceCategories = [
    { name: 'Compute', href: '/resource-catalog?category=compute', icon: Cpu }, // Query params are illustrative
    { name: 'Storage', href: '/resource-catalog?category=storage', icon: Database },
    { name: 'Networking', href: '/resource-catalog?category=networking', icon: Network },
  ];
  
  // For actual filtering, the /resource-catalog page would need to handle these query params.
  // For simplicity, they can all link to /resource-catalog.
  // Let's adjust them to link to /resource-catalog for now as per App.tsx defined routes.
   const adjustedServiceCategories = [
    { name: 'Compute', href: '/resource-catalog', icon: Cpu, query: 'compute' }, 
    { name: 'Storage', href: '/resource-catalog', icon: Database, query: 'storage' },
    { name: 'Networking', href: '/resource-catalog', icon: Network, query: 'networking' },
  ];


  return (
    <aside className={`hidden border-r bg-muted/40 md:block ${className}`}>
      <div className=\"flex h-full max-h-screen flex-col gap-2 sticky top-16\"> {/* Assuming header height is 16 (4rem) */}
        <div className=\"flex-1 overflow-auto py-2\">\n          <nav className=\"grid items-start px-4 text-sm font-medium\">\n            <div className=\"p-2\">\n              <Button asChild className=\"w-full justify-start\">\n                <Link to=\"/create-resource\">\n                  <PlusCircle className=\"mr-2 h-4 w-4\" />\n                  Create Resource\n                </Link>\n              </Button>\n            </div>\n\n            <Separator className=\"my-2\" />\n            \n            <NavLink
                to=\"/\"\n                className={navLinkClasses}\n                end // Ensure exact match for dashboard\n              >\n                <LayoutDashboard className=\"h-4 w-4\" />\n                Dashboard\n            </NavLink>\n\n\n            <p className=\"px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2\">\n              Service Categories\n            </p>\n            {adjustedServiceCategories.map((item) => (\n              <NavLink\n                key={item.name}\n                // to={`${item.href}?category=${item.query}`} // This would be ideal if page supported it\n                to={item.href} // Simplified to match App.tsx more directly\n                className={({ isActive }) => \n                  navLinkClasses({ isActive: isActive && window.location.search.includes(`category=${item.query}`) })\n                  // A more robust active state for query params would require more complex logic or library support\n                  // For now, it will highlight if /resource-catalog is active.\n                }\n              >\n                <item.icon className=\"h-4 w-4\" />\n                {item.name}\n              </NavLink>\n            ))}\n            \n            <Separator className=\"my-2\" />\n\n            <NavLink\n              to=\"/account-settings\" // Updated to point to the existing ProfilePage route\n              className={navLinkClasses}\n            >\n              <SettingsIcon className=\"h-4 w-4\" />\n              Settings\n            </NavLink>\n          </nav>\n        </div>\n      </div>\n    </aside>\n  );\n};\n\nexport default DashboardSidebar;