import React from 'react';

export type ResourceStatusType =
  | 'Running'
  | 'Active'
  | 'Online'
  | 'Stopped'
  | 'Offline'
  | 'Provisioning'
  | 'Creating'
  | 'Pending'
  | 'Updating'
  | 'Deleting'
  | 'Error'
  | 'Failed'
  | 'Warning'
  | 'Maintenance'
  | 'Unknown';

interface ResourceStatusIndicatorProps {
  /** The current status of the resource. Common statuses are typed, but any string can be passed. */
  status: ResourceStatusType | string;
  /** Whether to display the text label next to the dot. Defaults to true. */
  showText?: boolean;
  /** Optional additional CSS classes to apply to the component's root element. */
  className?: string;
}

const ResourceStatusIndicator: React.FC<ResourceStatusIndicatorProps> = ({
  status,
  showText = true,
  className = '',
}) => {
  console.log('ResourceStatusIndicator loaded with status:', status);

  let dotColorClass = 'bg-gray-400'; // Default for unknown status
  let textColorClass = 'text-gray-700';
  let displayText = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(); // Capitalize first letter, lowercase rest

  switch (status.toLowerCase()) {
    case 'running':
    case 'active':
    case 'online':
      dotColorClass = 'bg-green-500';
      textColorClass = 'text-green-700';
      displayText = 'Running';
      break;
    case 'stopped':
    case 'offline':
      dotColorClass = 'bg-gray-500'; // Using gray for stopped as it's less alarming than red unless it's an error
      textColorClass = 'text-gray-700';
      displayText = 'Stopped';
      break;
    case 'provisioning':
    case 'creating':
      dotColorClass = 'bg-blue-500 animate-pulse';
      textColorClass = 'text-blue-700';
      displayText = 'Provisioning';
      break;
    case 'pending':
      dotColorClass = 'bg-yellow-500';
      textColorClass = 'text-yellow-700';
      displayText = 'Pending';
      break;
    case 'updating':
      dotColorClass = 'bg-purple-500 animate-pulse';
      textColorClass = 'text-purple-700';
      displayText = 'Updating';
      break;
    case 'deleting':
      dotColorClass = 'bg-orange-500 animate-pulse';
      textColorClass = 'text-orange-700';
      displayText = 'Deleting';
      break;
    case 'error':
    case 'failed':
      dotColorClass = 'bg-red-600';
      textColorClass = 'text-red-700';
      displayText = 'Error';
      break;
    case 'warning':
      dotColorClass = 'bg-yellow-400';
      textColorClass = 'text-yellow-800';
      displayText = 'Warning';
      break;
    case 'maintenance':
      dotColorClass = 'bg-indigo-500';
      textColorClass = 'text-indigo-700';
      displayText = 'Maintenance';
      break;
    case 'unknown':
      dotColorClass = 'bg-gray-300';
      textColorClass = 'text-gray-500';
      displayText = 'Unknown';
      break;
    default:
      // For truly custom statuses not in the switch, use the default gray and capitalized input.
      // displayText is already set.
      break;
  }

  return (
    <div className={`flex items-center space-x-1.5 ${className}`}>
      <span
        className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${dotColorClass}`}
        aria-hidden="true"
      ></span>
      {showText && (
        <span className={`text-xs font-medium ${textColorClass}`}>{displayText}</span>
      )}
    </div>
  );
};

export default ResourceStatusIndicator;