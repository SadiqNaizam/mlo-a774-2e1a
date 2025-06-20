import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Custom Components
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import ServiceOfferingCard from '@/components/ServiceOfferingCard';

// shadcn/ui Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// lucide-react icons
import { Server, HardDrive, Database as DatabaseIcon, Package as PackageIcon, Search, WifiOff } from 'lucide-react';

interface ServiceOffering {
  id: string;
  icon: React.ReactNode;
  serviceName: string;
  description: string;
  actionText: string;
  actionLink: string; // Should align with App.tsx routes
  tags: string[]; // For filtering
}

const allServiceOfferings: ServiceOffering[] = [
  {
    id: 'vm',
    icon: <Server className="w-12 h-12 text-blue-500" />,
    serviceName: 'Virtual Machines',
    description: 'Provision scalable Linux and Windows virtual machines in seconds with full control.',
    actionText: 'Create VM',
    actionLink: '/create-resource', // Route from App.tsx
    tags: ['compute', 'vm', 'server', 'linux', 'windows'],
  },
  {
    id: 'storage',
    icon: <HardDrive className="w-12 h-12 text-green-500" />,
    serviceName: 'Blob Storage',
    description: 'Highly scalable and secure object storage for unstructured data, archives, and big data.',
    actionText: 'Create Storage',
    actionLink: '/create-resource', // Route from App.tsx
    tags: ['storage', 'blob', 'files', 'data', 'backup'],
  },
  {
    id: 'database',
    icon: <DatabaseIcon className="w-12 h-12 text-purple-500" />,
    serviceName: 'Managed Databases',
    description: 'Fully managed relational and NoSQL database services with built-in high availability.',
    actionText: 'Create Database',
    actionLink: '/create-resource', // Route from App.tsx
    tags: ['database', 'sql', 'nosql', 'managed', 'data'],
  },
  {
    id: 'containers',
    icon: <PackageIcon className="w-12 h-12 text-orange-500" />,
    serviceName: 'Container Instances',
    description: 'Run Docker containers on-demand in a managed, serverless Azure environment.',
    actionText: 'Deploy Container',
    actionLink: '/create-resource', // Route from App.tsx
    tags: ['containers', 'docker', 'kubernetes', 'microservices', 'serverless'],
  },
];

const ResourceCatalogPage = () => {
  console.log('ResourceCatalogPage loaded');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServiceOfferings = useMemo(() => {
    if (!searchTerm.trim()) {
      return allServiceOfferings;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return allServiceOfferings.filter(
      (service) =>
        service.serviceName.toLowerCase().includes(lowerSearchTerm) ||
        service.description.toLowerCase().includes(lowerSearchTerm) ||
        service.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
    );
  }, [searchTerm]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <AppHeader />
      <div className="flex flex-1">
        <DashboardSidebar className="top-16" /> {/* Adjust top if header height changes */}
        <main className="flex-1 p-6">
          <section className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Resource Catalog</h1>
                    <p className="text-muted-foreground mt-1">
                        Browse and select cloud services to provision for your projects.
                    </p>
                </div>
                 <Button asChild className="mt-4 sm:mt-0">
                    <Link to="/create-resource">Create Resource</Link>
                 </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search services (e.g., 'VM', 'storage', 'database')..."
                className="pl-10 w-full md:w-1/2 lg:w-1/3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search cloud services"
              />
            </div>
          </section>

          {filteredServiceOfferings.length > 0 ? (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServiceOfferings.map((service) => (
                <ServiceOfferingCard
                  key={service.id}
                  icon={service.icon}
                  serviceName={service.serviceName}
                  description={service.description}
                  actionText={service.actionText}
                  actionLink={service.actionLink} // This will navigate to /create-resource
                  // If CreateResourcePage needs to know which service, it could take state via Link
                  // e.g. <Link to={service.actionLink} state={{ serviceType: service.id }}>
                />
              ))}
            </section>
          ) : (
            <section className="text-center py-12">
              <WifiOff className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">No Services Found</h2>
              <p className="text-muted-foreground mt-2">
                Your search for "{searchTerm}" did not match any service offerings. Try a different term.
              </p>
            </section>
          )}
        </main>
      </div>
      <AppFooter />
    </div>
  );
};

export default ResourceCatalogPage;