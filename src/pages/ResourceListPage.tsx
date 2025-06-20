import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AppHeader from '@/components/layout/AppHeader';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import AppFooter from '@/components/layout/AppFooter';
import ResourceStatusIndicator, { ResourceStatusType } from '@/components/ResourceStatusIndicator';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // For overall page structure

import { PlusCircle, Search, Settings, Trash2, Filter } from 'lucide-react';

// Sample data structure for resources
interface CloudResource {
  id: string;
  name: string;
  type: string;
  status: ResourceStatusType;
  region: string;
  createdAt: string; // ISO date string
}

const sampleResources: CloudResource[] = [
  { id: 'vm-001', name: 'Frontend Web Server', type: 'Virtual Machine', status: 'Running', region: 'East US', createdAt: '2024-07-15T10:30:00Z' },
  { id: 'db-main-01', name: 'Primary SQL Database', type: 'Database Server', status: 'Active', region: 'West Europe', createdAt: '2024-07-10T14:00:00Z' },
  { id: 'st-backup-central', name: 'Backup Storage Blob', type: 'Storage Account', status: 'Online', region: 'Central US', createdAt: '2024-06-01T08:00:00Z' },
  { id: 'vm-dev-test', name: 'Development Environment VM', type: 'Virtual Machine', status: 'Stopped', region: 'East US', createdAt: '2024-07-18T11:45:00Z' },
  { id: 'vm-new-provision', name: 'New API Gateway VM', type: 'Virtual Machine', status: 'Provisioning', region: 'West Europe', createdAt: '2024-07-20T09:15:00Z' },
  { id: 'network-main-vnet', name: 'Main Virtual Network', type: 'Virtual Network', status: 'Active', region: 'East US', createdAt: '2024-05-20T16:00:00Z' },
  { id: 'vm-k8s-node-1', name: 'Kubernetes Worker Node 1', type: 'Virtual Machine', status: 'Running', region: 'West Europe', createdAt: '2024-07-19T12:00:00Z' },
  { id: 'func-app-orders', name: 'Order Processing Function App', type: 'Function App', status: 'Warning', region: 'Central US', createdAt: '2024-07-12T17:30:00Z' },
  { id: 'vm-legacy-system', name: 'Legacy App Server', type: 'Virtual Machine', status: 'Error', region: 'East US', createdAt: '2024-04-01T00:00:00Z' },
  { id: 'cdn-global-assets', name: 'Global CDN Profile', type: 'CDN', status: 'Active', region: 'Global', createdAt: '2024-06-15T10:00:00Z' },
];

const ITEMS_PER_PAGE = 5;

const ResourceListPage = () => {
  console.log('ResourceListPage loaded');
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredResources = useMemo(() => {
    return sampleResources.filter(resource =>
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.region.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
  const paginatedResources = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredResources.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredResources, currentPage]);

  const handleManageResource = (resourceId: string) => {
    // Navigate to ResourceDetailPage, passing resourceId in state
    navigate('/resource-detail', { state: { resourceId } });
  };

  const handleDeleteResource = (resourceId: string, resourceName: string) => {
    // Placeholder for delete functionality
    // In a real app, this would involve an API call and state update
    // For now, use window.confirm and log to console
    if (window.confirm(`Are you sure you want to delete "${resourceName}" (ID: ${resourceId})? This action cannot be undone.`)) {
      console.log(`Deleting resource ID: ${resourceId}`);
      // Here you would filter out the resource from your state
      // For this example, we are not modifying the sampleResources directly
      alert(`Resource "${resourceName}" delete action initiated (simulated).`);
    }
  };
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <AppHeader />
      <div className="flex flex-1">
        <DashboardSidebar className="w-64 sticky top-16 h-[calc(100vh-4rem)] hidden md:block" />
        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto h-[calc(100vh-4rem)]">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>My Resources</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-semibold">My Resources</CardTitle>
              <Button asChild size="sm">
                <Link to="/create-resource">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Resource
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
                <div className="relative flex-grow w-full sm:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name, type, or region..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset to first page on new search
                    }}
                  />
                </div>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  {paginatedResources.length === 0 && searchTerm && (
                     <TableCaption>No resources found matching your search criteria.</TableCaption>
                  )}
                  {paginatedResources.length === 0 && !searchTerm && (
                     <TableCaption>No resources available. <Link to="/create-resource" className="text-primary hover:underline">Create one now</Link>.</TableCaption>
                  )}
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedResources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium">{resource.name}</TableCell>
                        <TableCell>{resource.type}</TableCell>
                        <TableCell>
                          <ResourceStatusIndicator status={resource.status} showText={true} />
                        </TableCell>
                        <TableCell>{resource.region}</TableCell>
                        <TableCell>{new Date(resource.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleManageResource(resource.id)}>
                            <Settings className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" /> Manage
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteResource(resource.id, resource.name)}>
                            <Trash2 className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" /> Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                        />
                      </PaginationItem>
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        // Basic pagination logic: show first, last, current, and nearby pages
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                href="#"
                                isActive={currentPage === pageNum}
                                onClick={(e) => { e.preventDefault(); handlePageChange(pageNum); }}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (
                          (pageNum === currentPage - 2 && pageNum !== 1) ||
                          (pageNum === currentPage + 2 && pageNum !== totalPages)
                        ) {
                          return <PaginationEllipsis key={`ellipsis-${pageNum}`} />;
                        }
                        return null;
                      })}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
      <AppFooter />
    </div>
  );
};

export default ResourceListPage;