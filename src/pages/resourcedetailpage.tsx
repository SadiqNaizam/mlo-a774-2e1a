import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Custom Components
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import ResourceStatusIndicator, { ResourceStatusType } from '@/components/ResourceStatusIndicator';

// shadcn/ui Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast"; // For notifications

// Charting
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

// Icons
import { Play, StopCircle, RefreshCcw, Trash2, Settings as SettingsIconLucide, Server, Activity, HardDrive, Cpu as CpuIcon, MemoryStick, AlertTriangle } from 'lucide-react';

// Forms & Validation
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define the structure for resource details
interface ResourceDetail {
  id: string;
  name: string;
  type: string;
  status: ResourceStatusType;
  region: string;
  ipAddress?: string;
  size?: string; // e.g. "Standard_D2s_v3" or "2 vCPUs, 8GB RAM"
  os?: string;
  disk?: string;
  createdAt: string; // ISO date string
  tags?: { key: string; value: string }[];
  // Add any other specific fields you might need
}

// Mock Data (Simulating API Response)
const defaultMockResource: ResourceDetail = {
  id: 'vm-default-123',
  name: 'Default VM Server',
  type: 'Virtual Machine',
  status: 'Running',
  region: 'East US',
  ipAddress: '203.0.113.45',
  size: '4 vCPUs, 16GB RAM',
  os: 'Ubuntu 22.04 LTS',
  disk: '512GB SSD',
  createdAt: new Date().toISOString(),
  tags: [{ key: 'env', value: 'production' }, { key: 'app', value: 'webserver' }],
};

const monitoringData = {
  cpu: [
    { time: '10:00', usage: 20 }, { time: '10:05', usage: 25 }, { time: '10:10', usage: 22 },
    { time: '10:15', usage: 30 }, { time: '10:20', usage: 28 }, { time: '10:25', usage: 35 },
  ],
  memory: [
    { time: '10:00', usage: 40 }, { time: '10:05', usage: 42 }, { time: '10:10', usage: 38 },
    { time: '10:15', usage: 45 }, { time: '10:20', usage: 43 }, { time: '10:25', usage: 50 },
  ],
  network: [
    { time: '10:00', received: 1.2, sent: 0.5 }, { time: '10:05', received: 1.5, sent: 0.7 },
    { time: '10:10', received: 1.1, sent: 0.4 }, { time: '10:15', received: 1.8, sent: 0.9 },
    { time: '10:20', received: 1.6, sent: 0.8 }, { time: '10:25', received: 2.0, sent: 1.0 },
  ],
};

// Form Schema for Settings
const settingsFormSchema = z.object({
  name: z.string().min(3, { message: "Resource name must be at least 3 characters." }).max(50),
  tags: z.string().optional(), // Simple string for tags for now, could be more complex
  description: z.string().max(200, { message: "Description cannot exceed 200 characters."}).optional(),
});

const ResourceDetailPage: React.FC = () => {
  console.log('ResourceDetailPage loaded');
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [resource, setResource] = useState<ResourceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const resourceId = location.state?.resourceId as string | undefined;

  const form = useForm<z.infer<typeof settingsFormSchema>>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      name: '',
      tags: '',
      description: '',
    },
  });

  useEffect(() => {
    setIsLoading(true);
    if (resourceId) {
      console.log('Fetching details for resource ID:', resourceId);
      // Simulate API call
      setTimeout(() => {
        const fetchedResource: ResourceDetail = {
          ...defaultMockResource, // Base mock
          id: resourceId,
          name: `VM-${resourceId.slice(0, 8)}`, // Make name unique based on ID
          // Potentially fetch actual data here or use more varied mock data
        };
        setResource(fetchedResource);
        form.reset({
          name: fetchedResource.name,
          tags: fetchedResource.tags?.map(t => `${t.key}=${t.value}`).join(', ') || '',
          description: `This is ${fetchedResource.name}, a ${fetchedResource.type} in ${fetchedResource.region}.`,
        });
        setIsLoading(false);
      }, 500);
    } else {
      console.warn('No resourceId found in location state. Displaying default or redirecting.');
      // Option 1: Show a default/error state
      // setResource(defaultMockResource); 
      // form.reset({ name: defaultMockResource.name, tags: defaultMockResource.tags?.map(t => `${t.key}=${t.value}`).join(', ') || '' });
      // setIsLoading(false);
      // Option 2: Redirect or show error message
      toast({
        title: "Error",
        description: "Resource details could not be loaded. No ID provided.",
        variant: "destructive",
      });
      navigate('/resource-list'); // Redirect to resource list if no ID
    }
  }, [resourceId, navigate, form, toast]);

  const handleStart = () => {
    if (!resource) return;
    console.log(`Starting resource ${resource.id}`);
    setResource(prev => prev ? { ...prev, status: 'Provisioning' } : null); // Simulating 'Starting'
    toast({ title: "Action Initiated", description: `Starting ${resource.name}...` });
    setTimeout(() => setResource(prev => prev ? { ...prev, status: 'Running' } : null), 2000);
  };

  const handleStop = () => {
    if (!resource) return;
    console.log(`Stopping resource ${resource.id}`);
    setResource(prev => prev ? { ...prev, status: 'Deleting' } : null); // Simulating 'Stopping'
    toast({ title: "Action Initiated", description: `Stopping ${resource.name}...` });
    setTimeout(() => setResource(prev => prev ? { ...prev, status: 'Stopped' } : null), 2000);
  };

  const handleRestart = () => {
    if (!resource) return;
    console.log(`Restarting resource ${resource.id}`);
    setResource(prev => prev ? { ...prev, status: 'Updating' } : null); // Simulating 'Restarting'
    toast({ title: "Action Initiated", description: `Restarting ${resource.name}...` });
    setTimeout(() => setResource(prev => prev ? { ...prev, status: 'Running' } : null), 3000);
  };
  
  const handleDelete = () => {
    if (!resource) return;
    console.log(`Deleting resource ${resource.id}`);
    // Here you would typically show a confirmation dialog
    toast({ title: "Confirm Deletion", description: `Resource ${resource.name} will be deleted permanently. This action cannot be undone.`, variant: "destructive" });
    // For now, simulate deletion and navigate away
    // setResource(prev => prev ? { ...prev, status: 'Deleting' } : null);
    // setTimeout(() => navigate('/resource-list'), 2000);
  };

  function onSettingsSubmit(values: z.infer<typeof settingsFormSchema>) {
    console.log("Settings updated:", values);
    if (resource) {
        setResource(prev => prev ? {
            ...prev,
            name: values.name,
            // Basic tag parsing, in reality this would be more robust
            tags: values.tags?.split(',').map(tag => {
                const [key, value] = tag.split('=');
                return { key: key?.trim(), value: value?.trim() };
            }).filter(t => t.key && t.value) || []
        } : null);
    }
    toast({
      title: "Settings Saved",
      description: "Resource settings have been updated.",
    });
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <div className="flex flex-1">
          <DashboardSidebar className="hidden md:block" />
          <div className="flex-1 p-6 flex items-center justify-center">
            <p>Loading resource details...</p> {/* Replace with Skeleton if available and desired */}
          </div>
        </div>
        <AppFooter />
      </div>
    );
  }

  if (!resource) {
     // This case should ideally be handled by redirection in useEffect, but as a fallback:
    return (
        <div className="flex flex-col min-h-screen">
            <AppHeader />
            <div className="flex flex-1">
            <DashboardSidebar className="hidden md:block" />
            <main className="flex-1 p-6 overflow-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Resource Not Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>The requested resource could not be found or an ID was not provided.</p>
                        <Button asChild className="mt-4">
                            <Link to="/resource-list">Go to Resource List</Link>
                        </Button>
                    </CardContent>
                </Card>
            </main>
            </div>
            <AppFooter />
      </div>
    );
  }

  const overviewDetails = [
    { label: 'ID', value: resource.id, icon: HardDrive },
    { label: 'Type', value: resource.type, icon: Server },
    { label: 'Region', value: resource.region, icon: CpuIcon }, // Using CpuIcon as generic location icon
    { label: 'Public IP', value: resource.ipAddress || 'N/A', icon: Network },
    { label: 'Size/Spec', value: resource.size || 'N/A', icon: CpuIcon },
    { label: 'Operating System', value: resource.os || 'N/A', icon: SettingsIconLucide },
    { label: 'Disk', value: resource.disk || 'N/A', icon: HardDrive },
    { label: 'Created At', value: new Date(resource.createdAt).toLocaleString(), icon: Activity },
    { label: 'Tags', value: resource.tags?.map(t => `${t.key}=${t.value}`).join(', ') || 'None', icon: MemoryStick },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <AppHeader />
      <div className="flex flex-1">
        <DashboardSidebar className="hidden md:block" />
        <ScrollArea className="flex-1">
          <main className="p-4 md:p-6 lg:p-8 space-y-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild><Link to="/">Dashboard</Link></BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild><Link to="/resource-list">My Resources</Link></BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{resource.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <Card>
              <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold">{resource.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <ResourceStatusIndicator status={resource.status} />
                    <span className="text-sm text-muted-foreground">{resource.type} &bull; {resource.region}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={handleStart} disabled={resource.status === 'Running' || resource.status === 'Provisioning'}>
                    <Play className="mr-2 h-4 w-4" /> Start
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleStop} disabled={resource.status === 'Stopped' || resource.status === 'Deleting'}>
                    <StopCircle className="mr-2 h-4 w-4" /> Stop
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRestart} disabled={resource.status !== 'Running'}>
                    <RefreshCcw className="mr-2 h-4 w-4" /> Restart
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-4">
                    <TabsTrigger value="overview">
                      <Server className="mr-2 h-4 w-4" /> Overview
                    </TabsTrigger>
                    <TabsTrigger value="monitoring">
                      <Activity className="mr-2 h-4 w-4" /> Monitoring
                    </TabsTrigger>
                    <TabsTrigger value="settings">
                      <SettingsIconLucide className="mr-2 h-4 w-4" /> Settings
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <Card>
                      <CardHeader>
                        <CardTitle>Resource Overview</CardTitle>
                        <CardDescription>Detailed information about {resource.name}.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableBody>
                            {overviewDetails.map((detail) => (
                              <TableRow key={detail.label}>
                                <TableCell className="font-medium w-1/3 flex items-center">
                                  <detail.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                                  {detail.label}
                                </TableCell>
                                <TableCell>{detail.value}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="monitoring">
                    <Card>
                      <CardHeader>
                        <CardTitle>Resource Monitoring</CardTitle>
                        <CardDescription>Live and historical performance metrics.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="h-[300px]">
                          <h3 className="text-md font-semibold mb-2">CPU Usage (%)</h3>
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monitoringData.cpu}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="time" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="usage" stroke="#8884d8" activeDot={{ r: 8 }} name="CPU Usage" unit="%" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="h-[300px]">
                          <h3 className="text-md font-semibold mb-2">Memory Usage (%)</h3>
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monitoringData.memory}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="time" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="usage" stroke="#82ca9d" activeDot={{ r: 8 }} name="Memory Usage" unit="%" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                         <div className="h-[300px]">
                          <h3 className="text-md font-semibold mb-2">Network I/O (MB/s)</h3>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monitoringData.network}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="time" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="received" fill="#8884d8" name="Received" unit="MB/s" />
                              <Bar dataKey="sent" fill="#82ca9d" name="Sent" unit="MB/s" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="settings">
                    <Card>
                      <CardHeader>
                        <CardTitle>Resource Settings</CardTitle>
                        <CardDescription>Modify configuration for {resource.name}. Changes may require a restart.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSettingsSubmit)} className="space-y-8">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Resource Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter resource name" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    A friendly name for your resource.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="tags"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Tags</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., env=prod, department=IT" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Comma-separated key=value pairs.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                             <FormField
                              control={form.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea placeholder="A brief description of the resource and its purpose." {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit">Save Settings</Button>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </main>
        </ScrollArea>
      </div>
      <AppFooter />
    </div>
  );
};

export default ResourceDetailPage;