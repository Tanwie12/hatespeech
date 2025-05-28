import { Card, CardContent } from '@/components/ui/card';
import { Shield, Zap, BarChart2, FileText, RefreshCw, Lock } from 'lucide-react';

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Powerful Features for Content Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="h-6 w-6 text-blue-600" />}
            title="Real-time Analysis"
            description="Get instant results for your content analysis with our advanced AI model."
          />
          <FeatureCard
            icon={<BarChart2 className="h-6 w-6 text-blue-600" />}
            title="Detailed Analytics"
            description="Comprehensive dashboard with insights and trends visualization."
          />
          <FeatureCard
            icon={<FileText className="h-6 w-6 text-blue-600" />}
            title="Bulk Processing"
            description="Upload and analyze multiple entries with CSV file support."
          />
          <FeatureCard
            icon={<RefreshCw className="h-6 w-6 text-blue-600" />}
            title="Continuous Learning"
            description="Our model continuously improves with new data for better accuracy."
          />
          <FeatureCard
            icon={<Lock className="h-6 w-6 text-blue-600" />}
            title="Secure & Private"
            description="Your data is encrypted and processed with the highest security standards."
          />
          <FeatureCard
            icon={<Shield className="h-6 w-6 text-blue-600" />}
            title="Content Moderation"
            description="Effectively moderate content across your platforms and communities."
          />
        </div>
      </div>
    </section>
  );
}
