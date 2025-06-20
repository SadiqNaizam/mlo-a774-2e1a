import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Settings2 } from 'lucide-react';
import ResourceStatusIndicator from '@/components/ResourceStatusIndicator'; // Assumed to exist as per <already-generated-components>

// Define possible statuses for a resource, to be used by this component and potentially by ResourceStatusIndicator
export type ResourceStatusType = 
  | 'Running' 
  | 'Stopped' 
  | 'Provisioning' 
  | 'Error' 
  | 'Starting' 
  | 'Stopping'
  | 'Deleting' 
  | 'Updating'
  | 'Requires Action'
  | 'Unknown';

interface ResourceCardProps {
  id: string; // Unique identifier for the resource
  name: string;
  type: string; // e.g., "Virtual Machine", "Storage Account"
  status: ResourceStatusType;
  region: string; // e.g., "East US", "West Europe"
  onManageClick?: (id: string) => void; // Optional callback for the "Manage" button
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  id,
  name,
  type,
  status,
  region,
  onManageClick,
}) => {
  console.log(`ResourceCard loaded for: ${name} (ID: ${id})`);

  const handleManage = () => {
    if (onManageClick) {
      onManageClick(id);
    } else {
      // Default action or log if no handler is provided
      console.log(`"Manage" clicked for resource ID: ${id}. No specific onManageClick handler provided.`);
      // Example: You could use toast notifications here
      // import { useToast } from "@/components/ui/use-toast"; // (would need to be imported)
      // const { toast } = useToast();
      // toast({ title: "Manage Action", description: `Manage action triggered for ${name}.` });
    }
  };

  return (
    <Card className="w-full flex flex-col transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold tracking-tight line-clamp-2">{name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{type} &bull; {region}</CardDescription>
      </CardHeader>

      <CardContent className="py-4 flex-grow space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
          {/* ResourceStatusIndicator is assumed to take 'status' prop and render accordingly */}
          <ResourceStatusIndicator status={status} />
        </div>
        {/* You can add more brief, relevant details here if needed based on resource type */}
        {/* Example:
        <div className="text-xs text-muted-foreground">
          <p>Instance Size: Standard_D2s_v3</p>
          <p>Public IP: 203.0.113.45</p>
        </div>
        */}
      </CardContent>

      <CardFooter className="p-4 border-t">
        <div className="flex w-full justify-end space-x-2">
          <Button variant="outline" size="sm" asChild>
            {/* Links to /resource-detail and passes resourceId in state for the detail page to use */}
            <Link to="/resource-detail" state={{ resourceId: id }}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </Button>
          <Button size="sm" onClick={handleManage}>
            <Settings2 className="mr-2 h-4 w-4" />
            Manage
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ResourceCard;