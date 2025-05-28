import StatusCard from '@/components/dashboard/status-card';
import type { DashboardData } from '@/types';

export default function MetricsGrid({ data }: { data: DashboardData | null }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatusCard
        title="Total Tweets Analyzed"
        value={data?.totalTweets || 0}
        change={data?.tweetChange}
        changeText="from last week"
        icon={<svg className="w-4 h-4" />}
      />
      <StatusCard
        title="Hate Speech Content"
        value={`${data?.hatePercent || 0}%`}
        progressValue={data?.hatePercent}
        variant="warning"
        icon={<svg className="w-4 h-4" />}
      />
      <StatusCard
        title="Hate Content"
        value={`${data?.hatePercent || 0}%`}
        progressValue={data?.hatePercent}
        variant="danger"
        icon={<svg className="w-4 h-4" />}
      />
      <StatusCard
        title="System Risk Level"
        value={data?.riskLevel || 'Unknown'}
        variant="warning"
        icon={<svg className="w-4 h-4" />}
      />
    </div>
  );
}
