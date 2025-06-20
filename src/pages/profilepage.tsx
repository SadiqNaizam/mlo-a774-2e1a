import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

// Layout Components
import AppHeader from '@/components/layout/AppHeader';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import AppFooter from '@/components/layout/AppFooter';

// ShadCN UI Components
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';

// Icons
import { Home, ChevronRight, User, Lock, Settings, Palette, Bell } from 'lucide-react';

// Mock user data structure
interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    emailMarketing: boolean;
    emailActivity: boolean;
    pushUpdates: boolean;
  };
}

// Mock API call to fetch user data
const fetchUserProfile = (): Promise<UserProfile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'user-123',
        fullName: 'Demo User',
        email: 'demo.user@example.com',
        bio: 'Cloud enthusiast and developer.',
        avatarUrl: 'https://github.com/shadcn.png', // Placeholder avatar
        theme: 'system',
        notifications: {
          emailMarketing: false,
          emailActivity: true,
          pushUpdates: true,
        },
      });
    }, 500);
  });
};

// Zod Schemas for forms
const profileFormSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.').max(50, 'Full name must be 50 characters or less.'),
  email: z.string().email('Invalid email address.').optional(), // Display only, not editable through this form
  bio: z.string().max(200, 'Bio must be 200 characters or less.').optional(),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(8, 'Password must be at least 8 characters.'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters.'),
  confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters.'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match.",
  path: ['confirmPassword'],
});

const preferencesFormSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  emailMarketing: z.boolean().default(false),
  emailActivity: z.boolean().default(true),
  pushUpdates: z.boolean().default(true),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;
type PreferencesFormValues = z.infer<typeof preferencesFormSchema>;

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { fullName: '', email: '', bio: '' },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const preferencesForm = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: { theme: 'system', emailMarketing: false, emailActivity: true, pushUpdates: true },
  });

  useEffect(() => {
    setIsLoading(true);
    fetchUserProfile().then((data) => {
      setUserProfile(data);
      profileForm.reset({ fullName: data.fullName, email: data.email, bio: data.bio || '' });
      preferencesForm.reset({
        theme: data.theme,
        emailMarketing: data.notifications.emailMarketing,
        emailActivity: data.notifications.emailActivity,
        pushUpdates: data.notifications.pushUpdates,
      });
      setIsLoading(false);
    });
  }, [profileForm, preferencesForm]);

  const onProfileSubmit = (data: ProfileFormValues) => {
    console.log('Profile data submitted:', data);
    // Simulate API call
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
        setUserProfile(prev => prev ? { ...prev, fullName: data.fullName, bio: data.bio } : null);
      }),
      {
        loading: 'Updating profile...',
        success: 'Profile updated successfully!',
        error: 'Failed to update profile.',
      }
    );
  };

  const onPasswordSubmit = (data: PasswordFormValues) => {
    console.log('Password data submitted:', data);
    // Simulate API call
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1000)),
      {
        loading: 'Changing password...',
        success: 'Password changed successfully!',
        error: 'Failed to change password.',
      }
    );
    passwordForm.reset();
  };

  const onPreferencesSubmit = (data: PreferencesFormValues) => {
    console.log('Preferences data submitted:', data);
     // Simulate API call
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
         setUserProfile(prev => prev ? {
            ...prev,
            theme: data.theme,
            notifications: {
                emailMarketing: data.emailMarketing,
                emailActivity: data.emailActivity,
                pushUpdates: data.pushUpdates
            }
        } : null);
        // Potentially apply theme change
        if (data.theme === 'dark') document.documentElement.classList.add('dark');
        else if (data.theme === 'light') document.documentElement.classList.remove('dark');
        // 'system' would need more logic based on OS preference
      }),
      {
        loading: 'Saving preferences...',
        success: 'Preferences saved successfully!',
        error: 'Failed to save preferences.',
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <div className="flex flex-1">
          <DashboardSidebar className="hidden md:block" />
          <main className="flex-1 p-6 flex items-center justify-center">
            <p>Loading profile...</p>
          </main>
        </div>
        <AppFooter />
      </div>
    );
  }

  if (!userProfile) {
    return (
       <div className="flex flex-col min-h-screen">
        <AppHeader />
        <div className="flex flex-1">
          <DashboardSidebar className="hidden md:block" />
          <main className="flex-1 p-6 flex items-center justify-center">
            <p>Could not load user profile. <Button variant="link" onClick={() => navigate('/')}>Go to Dashboard</Button></p>
          </main>
        </div>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <AppHeader />
      <div className="flex flex-1">
        <DashboardSidebar className="w-64 hidden lg:block sticky top-16 h-[calc(100vh-4rem)]" />
        <ScrollArea className="flex-1 h-[calc(100vh-4rem)]">
          <main className="p-4 sm:p-6 lg:p-8 space-y-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/"><Home className="h-4 w-4" /></Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator><ChevronRight className="h-4 w-4" /></BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Account Settings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Profile Information Card - Spans 1 column on md+ */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={userProfile.avatarUrl} alt={userProfile.fullName} />
                      <AvatarFallback>{userProfile.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl">{userProfile.fullName}</CardTitle>
                      <CardDescription>{userProfile.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{userProfile.bio || "No bio provided."}</p>
                  {/* Placeholder for "Upload new picture" or "Edit Avatar" button */}
                </CardContent>
              </Card>

              {/* Forms Card - Spans 2 columns on md+ */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Edit Profile Details</CardTitle>
                  <CardDescription>Manage your personal information, password, and application preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Profile Form */}
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-medium">Personal Information</h3>
                      </div>
                      <FormField
                        control={profileForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl><Input placeholder="Your email" {...field} readOnly className="bg-muted/50 cursor-not-allowed" /></FormControl>
                            <FormDescription>Email cannot be changed through this form.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl><Textarea placeholder="Tell us a little about yourself" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                        {profileForm.formState.isSubmitting ? 'Saving...' : 'Save Profile'}
                      </Button>
                    </form>
                  </Form>

                  {/* Password Form */}
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6 pt-6 border-t">
                       <div className="flex items-center space-x-2 mb-4">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-medium">Change Password</h3>
                      </div>
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl><Input type="password" placeholder="Enter current password" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl><Input type="password" placeholder="Enter new password" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl><Input type="password" placeholder="Confirm new password" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" variant="outline" disabled={passwordForm.formState.isSubmitting}>
                        {passwordForm.formState.isSubmitting ? 'Updating...' : 'Update Password'}
                      </Button>
                    </form>
                  </Form>

                  {/* Preferences Form */}
                  <Form {...preferencesForm}>
                    <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-6 pt-6 border-t">
                       <div className="flex items-center space-x-2 mb-4">
                        <Settings className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-medium">Preferences</h3>
                      </div>
                      <FormField
                        control={preferencesForm.control}
                        name="theme"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Theme</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select theme" /></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>Choose your preferred application theme.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Bell className="h-5 w-5 text-muted-foreground" />
                            <h4 className="text-md font-medium">Notification Settings</h4>
                        </div>
                        <FormField
                          control={preferencesForm.control}
                          name="emailMarketing"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Marketing Emails</FormLabel>
                                <FormDescription>Receive emails about new products and features.</FormDescription>
                              </div>
                              <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={preferencesForm.control}
                          name="emailActivity"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Activity Emails</FormLabel>
                                <FormDescription>Receive emails about activity on your account.</FormDescription>
                              </div>
                              <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={preferencesForm.control}
                          name="pushUpdates"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Push Notifications</FormLabel>
                                <FormDescription>Get push notifications for important updates (if app supports).</FormDescription>
                              </div>
                              <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="submit" disabled={preferencesForm.formState.isSubmitting}>
                        {preferencesForm.formState.isSubmitting ? 'Saving...' : 'Save Preferences'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </main>
        </ScrollArea>
      </div>
      <AppFooter />
    </div>
  );
};

export default ProfilePage;