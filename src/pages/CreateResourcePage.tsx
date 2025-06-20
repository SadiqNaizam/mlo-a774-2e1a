import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import AppHeader from '@/components/layout/AppHeader';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import AppFooter from '@/components/layout/AppFooter';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home, ChevronRight } from 'lucide-react';

const formSchema = z.object({
  resourceName: z.string().min(3, "Resource name must be at least 3 characters.").max(50, "Resource name must be 50 characters or less."),
  region: z.string().nonempty("Region is required."),
  osImage: z.string().nonempty("OS Image is required."),
  vmSize: z.string().nonempty("VM Size is required."),
  storageCapacity: z.number().min(10, "Storage must be at least 10GB.").max(1000, "Storage cannot exceed 1000GB."),
  enablePublicIp: z.boolean().default(false).optional(),
});

type CreateResourceFormValues = z.infer<typeof formSchema>;

const regions = ["East US", "West US", "Central Europe", "Southeast Asia"];
const osImages = ["Ubuntu 22.04 LTS", "Windows Server 2022", "Debian 11", "Fedora 38", "CentOS Stream 9"];
const vmSizes = [
  { id: "basic_1c_2gb", name: "Basic (1 vCPU, 2GB RAM)" },
  { id: "standard_2c_4gb", name: "Standard (2 vCPUs, 4GB RAM)" },
  { id: "pro_4c_8gb", name: "Pro (4 vCPUs, 8GB RAM)" },
  { id: "compute_8c_16gb", name: "Compute Optimized (8 vCPUs, 16GB RAM)" },
];

const CreateResourcePage: React.FC = () => {
  console.log('CreateResourcePage loaded');
  const navigate = useNavigate();

  const form = useForm<CreateResourceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resourceName: "",
      region: "",
      osImage: "",
      vmSize: "",
      storageCapacity: 50, // Default 50GB
      enablePublicIp: true,
    },
  });

  function onSubmit(data: CreateResourceFormValues) {
    console.log("Form submitted:", data);
    toast.success(`Resource "${data.resourceName}" deployment initiated!`, {
      description: `Region: ${data.region}, OS: ${data.osImage}, Size: ${data.vmSize}`,
    });
    // Simulate deployment and redirect
    setTimeout(() => {
      // In a real app, you might get back an ID for the new resource
      // and navigate to its detail page or a list page.
      // For now, navigate to resource list page as per user journey.
      navigate('/resource-list'); // Path from App.tsx
    }, 2000);
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <AppHeader />
      <div className="flex flex-1">
        <DashboardSidebar className="w-64 hidden lg:block" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/"><Home className="h-4 w-4" /></Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/resource-catalog">Services</Link> {/* Path from App.tsx */}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Create Resource</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Create New Resource</CardTitle>
              <CardDescription>
                Configure and launch a new cloud service instance. This example focuses on a Virtual Machine.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="resourceName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resource Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., my-production-vm" {...field} />
                        </FormControl>
                        <FormDescription>
                          A unique name for your resource.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Region</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a region" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {regions.map((region) => (
                              <SelectItem key={region} value={region}>
                                {region}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The geographical location where your resource will be hosted.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="osImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operating System Image</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an OS image" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {osImages.map((os) => (
                              <SelectItem key={os} value={os}>
                                {os}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The base operating system for your virtual machine.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="vmSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>VM Size (Tier)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a VM size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vmSizes.map((size) => (
                              <SelectItem key={size.id} value={size.id}>
                                {size.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Determines CPU, RAM, and other performance characteristics.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="storageCapacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Storage Capacity (GB)</FormLabel>
                        <FormControl>
                           {/* Slider expects value to be number[], so adapt single number */}
                          <Slider
                            defaultValue={[50]}
                            value={[field.value]} // Ensure field.value is a number
                            onValueChange={(value) => field.onChange(value[0])} // Update form with the single number
                            max={1000}
                            min={10}
                            step={10}
                            className="py-2"
                          />
                        </FormControl>
                        <FormDescription>
                          OS disk size: {field.value} GB.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enablePublicIp"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Enable Public IP Address
                          </FormLabel>
                          <FormDescription>
                            Assign a public IP to access the VM from the internet.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-3 pt-4">
                     <Button type="button" variant="outline" onClick={() => navigate('/')}> {/* Path from App.tsx */}
                        Cancel
                     </Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? "Deploying..." : "Deploy Resource"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>
      </div>
      <AppFooter />
    </div>
  );
};

export default CreateResourcePage;