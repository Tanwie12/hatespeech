// stores/dashboard-store.ts
import { create } from 'zustand';
import { DashboardData, TrendData, ActivityItem } from '@/types';

interface DashboardState {
  dashboardData: DashboardData | null;
  trendsData: TrendData | null;
  activityData: ActivityItem[];
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
  fetchTrendsData: () => Promise<void>;
  fetchActivityData: () => Promise<void>;
  refreshAllData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  dashboardData: null,
  trendsData: null,
  activityData: [],
  isLoading: false,
  error: null,
  
  fetchDashboardData: async () => {
    try {
      set({ isLoading: true, error: null });
      // In a real app, this would be an API call
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const dashboardData: DashboardData = {
        totalTweets: 24567,
        tweetChange: 2.5,
        hatePercent: 12,
        offensivePercent: 25,
        riskLevel: 'Medium Risk',
        classification: {
          neutral: 60,
          offensive: 25,
          hateSpeed: 15
        },
        systemStatus: {
          operational: true,
          lastUpdated: new Date().toISOString(),
          version: '1.2.3'
        },
        version: '1.2.3'
      };
      
      set({ dashboardData, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard data', 
        isLoading: false 
      });
    }
  },
  
  fetchTrendsData: async () => {
    try {
      set({ isLoading: true, error: null });
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const trendsData: TrendData = {
        neutral: [58, 62, 65, 62, 60, 63, 62],
        offensive: [22, 24, 22, 24, 25, 28, 25],
        hate: [8, 10, 12, 10, 8, 10, 12]
      };
      
      set({ trendsData, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch trends data', 
        isLoading: false 
      });
    }
  },
  
  fetchActivityData: async () => {
    try {
      set({ isLoading: true, error: null });
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const activityData: ActivityItem[] = [
        {
          id: '1',
          content: 'Great product, highly recommended! #happy',
          classification: 'Neutral',
          confidence: 98,
          time: new Date(Date.now() - 2 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          content: 'This service is terrible, waste of money',
          classification: 'Offensive',
          confidence: 87,
          time: new Date(Date.now() - 5 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          content: 'Amazing customer support team!',
          classification: 'Neutral',
          confidence: 95,
          time: new Date(Date.now() - 10 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          content: 'Never using this again. Horrible experience',
          classification: 'Offensive',
          confidence: 89,
          time: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        },
        {
          id: '5',
          content: 'Just what I needed, perfect solution',
          classification: 'Neutral',
          confidence: 96,
          time: new Date(Date.now() - 20 * 60 * 1000).toISOString()
        }
      ];
      
      set({ activityData, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch activity data', 
        isLoading: false 
      });
    }
  },
  
  refreshAllData: async () => {
    set({ isLoading: true });
    await Promise.all([
      useDashboardStore.getState().fetchDashboardData(),
      useDashboardStore.getState().fetchTrendsData(),
      useDashboardStore.getState().fetchActivityData()
    ]);
    set({ isLoading: false });
  }
}));
