import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DownloadIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import SystemStatus from '@/components/dashboard/system-status';
import type { DashboardData } from '@/types';

export default function FooterActions({ data }: { data: DashboardData | null }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6">
      <SystemStatus 
        operational={data?.systemStatus.operational || false}
        lastUpdated={data?.systemStatus.lastUpdated || ''}
        version={data?.version || ''}
      />
      
      <div className="flex space-x-4 mt-4 sm:mt-0">
        <Button variant="outline">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Download Report
        </Button>
        <Button asChild>
          <Link href="/data-input">
            Go to Data Input
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
