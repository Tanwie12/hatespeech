// app/dashboard/page.tsx
'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useDashboardStore } from '@/stores/dashboard-store';
import { useAnalysisStore } from '@/stores/analysis-store';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import type { DashboardData, TrendData, ActivityItem } from '@/types';

// Lazy load components
const MetricsGrid = dynamic(() => import('@/components/dashboard/metrics-grid'), {
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
      ))}
    </div>
  )
});

const ChartsGrid = dynamic(() => import('@/components/dashboard/charts-grid'), {
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-48 bg-gray-100 rounded"></div>
        </div>
      ))}
    </div>
  )
});

const ActivitySection = dynamic(() => import('@/components/dashboard/activity-section'), {
  loading: () => (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="h-48 bg-gray-100 rounded"></div>
    </div>
  )
});

const FooterActions = dynamic(() => import('@/components/dashboard/footer-actions'), {
  loading: () => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-48"></div>
      <div className="flex space-x-4 mt-4 sm:mt-0">
        <div className="h-9 bg-gray-200 rounded w-32"></div>
        <div className="h-9 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  )
});

export default function DashboardPage() {


  const prevDataRef = useRef<{
    dashboardData: DashboardData | null;
    trendsData: TrendData | null;
    activityData: ActivityItem[] | null;
  }>({
    dashboardData: null, 
    trendsData: null, 
    activityData: null 
  });

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
    // Only refresh if the data has actually changed
    if (JSON.stringify(prevDataRef.current.dashboardData) !== JSON.stringify(dashboardData) ||
        JSON.stringify(prevDataRef.current.trendsData) !== JSON.stringify(trendsData) ||
        JSON.stringify(prevDataRef.current.activityData) !== JSON.stringify(activityData)) {
      prevDataRef.current = {
        dashboardData,
        trendsData,
        activityData
      };
    }
  }, [dashboardData, trendsData, activityData]);

  // Subscribe to analysis store changes
  useEffect(() => {
    const unsubscribe = useAnalysisStore.subscribe((state, prevState) => {
      if (state.results.length !== prevState?.results.length || 
          state.uploadedFiles.length !== prevState?.uploadedFiles.length) {
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
      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      }>
        <MetricsGrid data={dashboardData} />
      </Suspense>

      {/* Charts Grid */}
      <Suspense fallback={
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-48 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      }>
        <ChartsGrid dashboardData={dashboardData} trendsData={trendsData} />
      </Suspense>

      {/* Activity Table */}
      <Suspense fallback={
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 animate-pulse">
          <div className="flex justify-between items-center mb-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="h-48 bg-gray-100 rounded"></div>
        </div>
      }>
        <ActivitySection 
          data={activityData}
          isLoading={isLoading}
          onRefresh={handleRefresh}
        />
      </Suspense>

      {/* Footer Actions */}
      <Suspense fallback={
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-48"></div>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <div className="h-9 bg-gray-200 rounded w-32"></div>
            <div className="h-9 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      }>
        <FooterActions data={dashboardData} />
      </Suspense>
    </div>
  );
}
