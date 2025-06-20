import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ServiceOfferingCardProps {
  /**
   * Icon element to display for the service (e.g., a lucide-react icon).
   * Recommended size: w-12 h-12 or similar.
   */
  icon: React.ReactNode;
  /**
   * Name of the cloud service.
   */
  serviceName: string;
  /**
   * A brief description of the cloud service.
   */
  description: string;
  /**
   * Text for the call-to-action button (e.g., "Create", "Learn More").
   */
  actionText: string;
  /**
   * The URL path for the call-to-action button.
   * Should correspond to a route in App.tsx (e.g., "/create-resource").
   */
  actionLink: string;
}

const ServiceOfferingCard: React.FC<ServiceOfferingCardProps> = ({
  icon,
  serviceName,
  description,
  actionText,
  actionLink,
}) => {
  console.log(`ServiceOfferingCard loaded for: ${serviceName}`);

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl group">
      <CardHeader className="items-center text-center p-6">
        <div className="mb-4 text-primary transition-transform duration-300 group-hover:scale-110">
          {/* Ensure the icon passed has appropriate styling (e.g., size) */}
          {icon}
        </div>
        <CardTitle className="text-xl font-semibold">{serviceName}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow px-6 pb-4">
        <p className="text-sm text-muted-foreground text-center line-clamp-3">
          {description}
        </p>
      </CardContent>
      <CardFooter className="p-4 border-t bg-muted/50">
        <Button asChild className="w-full">
          <Link to={actionLink}>{actionText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceOfferingCard;