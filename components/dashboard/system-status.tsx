// components/dashboard/system-status.tsx
import { formatTime } from '@/lib/utils/formatters';

interface SystemStatusProps {
  operational: boolean;
  lastUpdated: string;
  version: string;
}

export default function SystemStatus({ 
  operational, 
  lastUpdated, 
  version 
}: SystemStatusProps) {
  return (
    <div className="flex items-center text-sm text-gray-500">
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-2 ${operational ? 'bg-green-500' : 'bg-amber-500'}`} />
        <span>System {operational ? 'Operational' : 'Under Maintenance'}</span>
      </div>
      <div className="mx-3">•</div>
      <div>Last updated: {formatTime(lastUpdated)}</div>
      <div className="mx-3">•</div>
      <div>Version {version}</div>
    </div>
  );
}
