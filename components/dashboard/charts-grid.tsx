import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ClassificationChart from '@/components/dashboard/classification-chart';
import TrendChart from '@/components/dashboard/trend-chart';
import type { DashboardData, TrendData } from '@/types';

export default function ChartsGrid({ 
  dashboardData, 
  trendsData 
}: { 
  dashboardData: DashboardData | null;
  trendsData: TrendData | null;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Classification Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardData?.classification && (
            <ClassificationChart data={dashboardData.classification} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7-Day Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {trendsData && <TrendChart data={trendsData} />}
        </CardContent>
      </Card>
    </div>
  );
}
