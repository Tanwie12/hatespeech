// types/index.ts
export interface StatusCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeText?: string;
  progressValue?: number;
  icon?: React.ReactNode;
  variant?: 'default' | 'warning' | 'danger' | 'success';
}

export interface ClassificationData {
  neutral: number;
  offensive: number;
  hateSpeed: number;
}

export interface TrendData {
  neutral: number[];
  offensive: number[];
  hate: number[];
}

export interface ActivityItem {
  id: string;
  content: string;
  classification: 'Neutral' | 'Offensive' | 'Hate';
  confidence: number;
  time: string;
}

export interface SystemStatusData {
  operational: boolean;
  lastUpdated: string;
  version: string;
}

export interface DashboardData {
  totalTweets: number;
  tweetChange: number;
  hatePercent: number;
  riskLevel: string;
  classification: ClassificationData;
  systemStatus: SystemStatusData;
  version: string;
}
