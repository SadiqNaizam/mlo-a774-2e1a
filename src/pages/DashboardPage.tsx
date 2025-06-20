import React from 'react';
import { Link } from 'react-router-dom';

import AppHeader from '@/components/layout/AppHeader';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import AppFooter from '@/components/layout/AppFooter';
import ServiceOfferingCard from '@/components/ServiceOfferingCard';
import ResourceCard, { ResourceStatusType } from '@/components/ResourceCard'; // Import ResourceStatusType from ResourceCard

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cpu, Database, Network, Briefcase } from 'lucide-react'; // Added Briefcase as another example

// Sample data for Resource Cards
const sampleResources: Array<{ id: string; name: string; type: string; status: ResourceStatusType; region: string; }> = [
  { id: 'vm-123', name: 'Production Web Server', type: 'Virtual Machine', status: 'Running', region: 'East US' },
  { id: 'st-456', name: 'Project Alpha Data Lake', type: 'Storage Account', status: 'Provisioning', region: 'West Europe' },
  { id: 'db-789', name: 'Customer Analytics DB', type: 'SQL Database', status: 'Error', region: 'East US' },
  { id: 'vm-007', name: 'Development Sandbox VM', type: 'Virtual Machine', status: 'Stopped', region: 'North Europe' },
];

const DashboardPage: React.FC = () => {
  console.log('DashboardPage loaded');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <AppHeader />
      <div className="flex flex-1">
        <DashboardSidebar className="sticky top-16 h-[calc(100vh-4rem)]" /> {/* Header is h-16 (4rem) */}
        <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">
          
          {/* Welcome and Quick Create Section */}
          <section>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">Welcome to AzureLite</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Your central hub for managing cloud resources. Get started by exploring services or creating a new resource.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link to="/create-resource">Create New Resource</Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Explore Services Section */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-4 text-slate-700 dark:text-slate-200">Explore Popular Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ServiceOfferingCard
                icon={<Cpu size={40} className="text-blue-500" />}
                serviceName="Virtual Machines"
                description="Deploy scalable Linux or Windows virtual servers in minutes."
                actionText="Explore Compute"
                actionLink="/resource-catalog" // Links to general catalog, user can filter/select there
              />
              <ServiceOfferingCard
                icon={<Database size={40} className="text-green-500" />}
                serviceName="Storage Solutions"
                description="Secure and scalable object, file, and disk storage for your data."
                actionText="Explore Storage"
                actionLink="/resource-catalog"
              />
              <ServiceOfferingCard
                icon={<Network size={40} className="text-orange-500" />}
                serviceName="Networking Services"
                description="Build and manage your virtual networks, load balancers, and DNS."
                actionText="Explore Networking"
                actionLink="/resource-catalog"
              />
            </div>
          </section>

          {/* Your Resources Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl lg:text-2xl font-semibold text-slate-700 dark:text-slate-200">Your Active Resources</h2>
              <Button variant="outline" asChild>
                <Link to="/resource-list">View All Resources</Link>
              </Button>
            </div>
            {sampleResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sampleResources.slice(0,3).map(resource => ( // Show a few, link to full list
                  <ResourceCard key={resource.id} {...resource} />
                ))}
              </div>
            ) : (
              <Card className="shadow-sm">
                <CardContent className="p-6 text-center">
                  <Briefcase size={48} className="mx-auto text-slate-400 dark:text-slate-500 mb-4" />
                  <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-1">No resources found.</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    It looks like you haven't created any resources yet.
                  </p>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Link to="/create-resource">Create Your First Resource</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>
          
          {/* Service Health & Announcements Section (Placeholder) */}
          <section>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">Service Health & Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  All systems are currently operational.
                </p>
                {/* 
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-md">
                    <h4 className="font-medium text-green-700 dark:text-green-300 text-sm">Scheduled Maintenance</h4>
                    <p className="text-xs text-green-600 dark:text-green-400">
                        We will be performing scheduled maintenance on core networking components on July 30th, 02:00-04:00 UTC.
                    </p>
                </div>
                */}
              </CardContent>
            </Card>
          </section>

        </main>
      </div>
      <AppFooter />
    </div>
  );
};

export default DashboardPage;