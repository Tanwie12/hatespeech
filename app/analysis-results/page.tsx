// app/analysis/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { RefreshCcw, Download, MoreVertical, Trash2 } from 'lucide-react';
import Breadcrumb from '@/components/layout/breadcrumb';
import { useAnalysisStore } from '@/stores/analysis-store';
import { toast } from 'sonner';

export default function AnalysisPage() {
  // Store state
  const { 
    results,
    totalAnalyzed,
    classificationCounts,
    averageConfidence,
    isLoading,
    fetchResults,
    clearResults
  } = useAnalysisStore();

  // Local state for filters
  const [confidenceThreshold, setConfidenceThreshold] = useState([0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [classifications, setClassifications] = useState({
    hate: true,
    neutral: true
  });

  // Fetch results on mount and after file uploads
  useEffect(() => {
    fetchResults().catch(() => {
      toast.error('Failed to fetch analysis results');
    });
  }, [fetchResults]);

  // Subscribe to file uploads
  useEffect(() => {
    const unsubscribe = useAnalysisStore.subscribe((state, prevState) => {
      if (state.uploadedFiles !== prevState?.uploadedFiles) {
        fetchResults().catch(() => {
          toast.error('Failed to fetch updated results');
        });
      }
    });

    return () => unsubscribe();
  }, [fetchResults]);

  // Filter results based on user selections
  const filteredResults = results.filter(tweet => {
    const meetsConfidence = tweet.confidence >= confidenceThreshold[0];
    const classification = tweet.classification.toLowerCase();
    const meetsClassification = classifications[classification === 'offensive' ? 'hate' : classification as keyof typeof classifications];
    const meetsSearch = searchQuery === '' || 
      tweet.text.toLowerCase().includes(searchQuery.toLowerCase());
    
    return meetsConfidence && meetsClassification && meetsSearch;
  });

  const handleRefresh = async () => {
    try {
      await fetchResults();
      toast.success('Results refreshed successfully');
    } catch {
      toast.error('Failed to refresh results');
    }
  };

  const handleExportResults = () => {
    try {
      // Convert results to CSV format
      const headers = ['Tweet', 'Classification', 'Confidence', 'Timestamp'];
      const csvContent = [
        headers.join(','),
        ...filteredResults.map(tweet => [
          `"${tweet.text.replace(/"/g, '""')}"`, // Escape quotes in text
          tweet.classification,
          tweet.confidence.toFixed(1),
          new Date(tweet.timestamp).toLocaleString()
        ].join(','))
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `analysis-results-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      toast.error('Failed to export results');
    }
  };

  const handleDeleteResults = async () => {
    if (window.confirm('Are you sure you want to delete all analysis results? This action cannot be undone.')) {
      try {
        await clearResults();
        toast.success('All results deleted successfully');
      } catch {
        toast.error('Failed to delete results');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb />
      
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Analysis Dashboard</h1>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm font-medium text-gray-500 mb-1">Total Tweets</h2>
            <div className="text-3xl font-bold mb-1">{totalAnalyzed.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Tweets Processed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-1">Classification Distribution</h2>
              <div className="space-y-1 mt-2">
                <div className="text-xs">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  Neutral: {((classificationCounts.neutral / totalAnalyzed) * 100).toFixed(1)}%
                </div>
                <div className="text-xs">
                  <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                  Hate: {((classificationCounts.offensive / totalAnalyzed) * 100).toFixed(1)}%
                </div>
                <div className="text-xs">
                  <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                  Hate: {((classificationCounts.hate / totalAnalyzed) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            <div className="w-24 h-24">
              {/* Donut chart would go here - simplified for this example */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#22c55e" 
                  strokeWidth="20" 
                  strokeDasharray={`${(classificationCounts.neutral / totalAnalyzed) * 100} 100`} 
                  strokeDashoffset="25" 
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#f97316" 
                  strokeWidth="20" 
                  strokeDasharray={`${(classificationCounts.offensive / totalAnalyzed) * 100} 100`} 
                  strokeDashoffset={`${-((classificationCounts.neutral / totalAnalyzed) * 100) + 25}`}
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="20" 
                  strokeDasharray={`${(classificationCounts.hate / totalAnalyzed) * 100} 100`} 
                  strokeDashoffset={`${-(((classificationCounts.neutral + classificationCounts.offensive) / totalAnalyzed) * 100) + 25}`}
                />
                <circle cx="50" cy="50" r="30" fill="white" />
              </svg>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm font-medium text-gray-500 mb-1">Average Confidence</h2>
            <div className="text-3xl font-bold mb-1">{averageConfidence.toFixed(1)}%</div>
            <div className="text-xs text-gray-500">Confidence Score</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Panel */}
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium mb-4">Filters</h2>
            
            <div className="space-y-6">
              <div>
                <Input 
                  type="text" 
                  placeholder="Search tweets..." 
                  className="w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Classification</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hate" 
                      checked={classifications.hate}
                      onCheckedChange={(checked) => 
                        setClassifications(prev => ({ ...prev, hate: !!checked }))
                      } 
                    />
                    <label htmlFor="hate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Hate
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="neutral" 
                      checked={classifications.neutral}
                      onCheckedChange={(checked) => 
                        setClassifications(prev => ({ ...prev, neutral: !!checked }))
                      } 
                    />
                    <label htmlFor="neutral" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Neutral
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Confidence Threshold</h3>
                <Slider
                  value={confidenceThreshold}
                  onValueChange={setConfidenceThreshold}
                  max={100}
                  step={1}
                  className="mb-6"
                />
                <div className="text-sm text-gray-500 text-center">
                  {confidenceThreshold}% or higher
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Results Panel */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={handleExportResults}
                disabled={isLoading || filteredResults.length === 0}
              >
                <Download className="h-4 w-4" />
                Export Results ({filteredResults.length})
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="gap-2 bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 
                  shadow-sm hover:shadow-md active:shadow-sm focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                  disabled:bg-red-300 disabled:cursor-not-allowed disabled:shadow-none"
                onClick={handleDeleteResults}
                disabled={isLoading || totalAnalyzed === 0}
              >
                <Trash2 className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                Delete All
              </Button>
            </div>
          </div>
          
          {/* Results Table */}
          <Card>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tweet</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 w-28">Classification</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 w-24">Confidence</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 w-40">Timestamp</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        Loading results...
                      </td>
                    </tr>
                  ) : !results || results.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        No analysis results available. Try analyzing some text or uploading a file.
                      </td>
                    </tr>
                  ) : filteredResults.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        No results match your current filters. Try adjusting the confidence threshold or classification filters.
                      </td>
                    </tr>
                  ) : (
                    filteredResults.map((tweet) => (
                      <tr key={tweet.id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="line-clamp-2">{tweet.text}</div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge 
                            className={`
                              ${tweet.classification === 'Neutral' ? 'bg-green-100 text-green-800' : 
                                'bg-orange-100 text-orange-800'} 
                              hover:bg-opacity-90
                            `}
                          >
                            {tweet.classification === 'Offensive' ? 'Hate' : tweet.classification}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">{tweet.confidence.toFixed(1)}%</td>
                        <td className="py-4 px-4">{new Date(tweet.timestamp).toLocaleString()}</td>
                        <td className="py-4 px-4">
                          <Button variant="ghost" size="icon" className="mx-auto">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              
              <div className="bg-gray-50 border-t px-4 py-3 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {filteredResults.length} of {totalAnalyzed} results
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
