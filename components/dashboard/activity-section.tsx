import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import ActivityTable from '@/components/dashboard/activity-table';
import type { ActivityItem } from '@/types';

interface ActivitySectionProps {
  data: ActivityItem[] | null;
  isLoading: boolean;
  onRefresh: () => Promise<void>;
}

export default function ActivitySection({ 
  data, 
  isLoading, 
  onRefresh 
}: ActivitySectionProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isLoading}
        >
          {isLoading ? (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ReloadIcon className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <ActivityTable data={data || []} />
      </CardContent>
    </Card>
  );
}
