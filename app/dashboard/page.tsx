// app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useDashboardStore } from '@/stores/dashboard-store';
import { useAnalysisStore } from '@/stores/analysis-store';

import StatusCard from '@/components/dashboard/status-card';
import ClassificationChart from '@/components/dashboard/classification-chart';
import TrendChart from '@/components/dashboard/trend-chart';
import ActivityTable from '@/components/dashboard/activity-table';
import SystemStatus from '@/components/dashboard/system-status';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReloadIcon, DownloadIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { 
    dashboardData, 
    trendsData, 
    activityData, 
    isLoading, 
    refreshAllData
  } = useDashboardStore();

  // Initial data load
  useEffect(() => {
    refreshAllData().catch(() => {
      toast.error('Failed to load dashboard data');
    });
  }, [refreshAllData]);

  // Subscribe to analysis store changes
  useEffect(() => {
    // Subscribe to any changes in the analysis store
    const unsubscribe = useAnalysisStore.subscribe((state, prevState) => {
      // Check if the results have changed
      if (state.results !== prevState?.results || 
          state.uploadedFiles !== prevState?.uploadedFiles) {
        refreshAllData().catch(() => {
          toast.error('Failed to refresh dashboard data');
        });
      }
    });

    return () => unsubscribe();
  }, [refreshAllData]);

  const handleRefresh = async () => {
    try {
      await refreshAllData();
      toast.success('Dashboard data refreshed');
    } catch {
      toast.error('Failed to refresh dashboard data');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatusCard
          title="Total Tweets Analyzed"
          value={dashboardData?.totalTweets || 0}
          change={dashboardData?.tweetChange}
          changeText="from last week"
          icon={<svg className="w-4 h-4" />}
        />
        <StatusCard
          title="Hate Speech Content"
          value={`${dashboardData?.hatePercent || 0}%`}
          progressValue={dashboardData?.hatePercent}
          variant="warning"
          icon={<svg className="w-4 h-4" />}
        />
        <StatusCard
          title="Offensive Content"
          value={`${dashboardData?.offensivePercent || 0}%`}
          progressValue={dashboardData?.offensivePercent}
          variant="danger"
          icon={<svg className="w-4 h-4" />}
        />
        <StatusCard
          title="System Risk Level"
          value={dashboardData?.riskLevel || 'Unknown'}
          variant="warning"
          icon={<svg className="w-4 h-4" />}
        />
      </div>

      {/* Charts Grid */}
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

      {/* Activity Table */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
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
          <ActivityTable data={activityData} />
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6">
        <SystemStatus 
          operational={dashboardData?.systemStatus.operational || false}
          lastUpdated={dashboardData?.systemStatus.lastUpdated || ''}
          version={dashboardData?.version || ''}
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
    </div>
  );
}
