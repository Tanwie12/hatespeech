// stores/dashboard-store.ts
import { create } from 'zustand';
import { DashboardData, TrendData, ActivityItem } from '@/types';
import { useAnalysisStore } from './analysis-store';

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
      
      // Get data from analysis store
      const analysisState = useAnalysisStore.getState();
      
      const totalTweets = analysisState.totalAnalyzed;
      const { neutral, offensive, hate } = analysisState.classificationCounts;
      
      // Calculate percentages
      const hatePercent = Math.round(((offensive + hate) / totalTweets) * 100);
      const neutralPercent = Math.round((neutral / totalTweets) * 100);
      const offensivePercent = Math.round((offensive / totalTweets) * 100);
      const hateSpeedPercent = Math.round((hate / totalTweets) * 100);
      
      // Determine risk level based on hate speech percentage
      let riskLevel = 'Low Risk';
      if (hatePercent > 20) riskLevel = 'High Risk';
      else if (hatePercent > 10) riskLevel = 'Medium Risk';
      
      const dashboardData: DashboardData = {
        totalTweets,
        tweetChange: 0, // We can implement this later by tracking historical data
        hatePercent,
        riskLevel,
        classification: {
          neutral: neutralPercent,
          offensive: offensivePercent,
          hate: hateSpeedPercent
        },
        systemStatus: {
          operational: true,
          lastUpdated: new Date().toISOString(),
          version: '1.0.0'
        },
        version: '1.0.0'
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
      
      // Get data from analysis store
      const { results } = useAnalysisStore.getState();
      
      // Group results by hour and calculate percentages
      const hourlyData = results.reduce((acc: { [key: string]: { neutral: number; offensive: number; hate: number; total: number } }, tweet) => {
        const hour = new Date(tweet.timestamp).getHours();
        if (!acc[hour]) {
          acc[hour] = { neutral: 0, offensive: 0, hate: 0, total: 0 };
        }
        
        acc[hour][tweet.classification.toLowerCase() as 'neutral' | 'offensive' | 'hate']++;
        acc[hour].total++;
        return acc;
      }, {});
      
      // Convert to percentages for the last 7 hours
      const currentHour = new Date().getHours();
      const trendsData: TrendData = {
        neutral: [],
        offensive: [],
        hate: []
      };
      
      for (let i = 6; i >= 0; i--) {
        const hour = (currentHour - i + 24) % 24;
        const hourData = hourlyData[hour] || { neutral: 0, offensive: 0, hate: 0, total: 1 };
        
        trendsData.neutral.push(Math.round((hourData.neutral / hourData.total) * 100));
        trendsData.offensive.push(Math.round((hourData.offensive / hourData.total) * 100));
        trendsData.hate.push(Math.round((hourData.hate / hourData.total) * 100));
      }
      
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
      
      // Get latest results from analysis store
      const { results } = useAnalysisStore.getState();
      
      // Get the 5 most recent activities
      const activityData: ActivityItem[] = results
        .slice(0, 5)
        .map(result => ({
          id: result.id,
          content: result.text,
          classification: result.classification === 'Offensive' ? 'Hate' : result.classification,
          confidence: result.confidence,
          time: result.timestamp
        }));
      
      set({ activityData, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch activity data', 
        isLoading: false 
      });
    }
  },
  
  refreshAllData: async () => {
    try {
      set({ isLoading: true });
      
      // First refresh the analysis store data
      await useAnalysisStore.getState().fetchResults();
      
      // Then update all dashboard data
      await Promise.all([
        useDashboardStore.getState().fetchDashboardData(),
        useDashboardStore.getState().fetchTrendsData(),
        useDashboardStore.getState().fetchActivityData()
      ]);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to refresh data',
      });
    } finally {
      set({ isLoading: false });
    }
  }
}));
