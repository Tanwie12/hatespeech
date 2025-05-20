// app/analysis/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { RefreshCcw, Download, FileText, MoreVertical } from 'lucide-react';
import Breadcrumb from '@/components/layout/breadcrumb';

interface TweetData {
  id: string;
  content: string;
  classification: 'Neutral' | 'Offensive' | 'Hate';
  confidence: number;
  timestamp: string;
}

export default function AnalysisPage() {
  const [tweets, setTweets] = useState<TweetData[]>([
    {
      id: '1',
      content: 'This is a sample tweet that demonstrates the layout and design of our analysis results table. The content is truncated if it exceeds two lines.',
      classification: 'Neutral',
      confidence: 92,
      timestamp: '2024-02-10 14:30'
    },
    {
      id: '2',
      content: 'Another example tweet showing how different classifications are displayed with appropriate color-coding and styling',
      classification: 'Offensive',
      confidence: 87,
      timestamp: '2024-02-10 14:25'
    },
    {
      id: '3',
      content: 'A third tweet example to demonstrate the consistent layout and spacing of our table rows with varying content.',
      classification: 'Hate',
      confidence: 95,
      timestamp: '2024-02-10 14:20'
    },
    {
      id: '4',
      content: 'This tweet shows how the table handles longer content and maintains its structure while displaying all necessary information.',
      classification: 'Neutral',
      confidence: 88,
      timestamp: '2024-02-10 14:15'
    },
    {
      id: '5',
      content: 'Example tweet demonstrating the layout and formatting of our analysis results with proper spacing.',
      classification: 'Offensive',
      confidence: 91,
      timestamp: '2024-02-10 14:10'
    }
  ]);
  
  const [confidenceThreshold, setConfidenceThreshold] = useState([70]);
  const [classifications, setClassifications] = useState({
    hateSpeed: true,
    offensive: true,
    neutral: true
  });
  
  const totalTweets = 2547;
  
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb />
      
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Analysis Dashboard</h1>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm font-medium text-gray-500 mb-1">Total Tweets</h2>
            <div className="text-3xl font-bold mb-1">2,547</div>
            <div className="text-xs text-gray-500">Tweets Processed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-1">Classification Distribution</h2>
            </div>
            <div className="w-24 h-24">
              {/* Donut chart would go here - simplified for this example */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#2db5a9" strokeWidth="20" strokeDasharray="70 100" strokeDashoffset="25" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e77d55" strokeWidth="20" strokeDasharray="40 100" strokeDashoffset="-5" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#2c3e50" strokeWidth="20" strokeDasharray="20 100" strokeDashoffset="-45" />
                <circle cx="50" cy="50" r="30" fill="white" />
              </svg>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm font-medium text-gray-500 mb-1">Average Confidence</h2>
            <div className="text-3xl font-bold mb-1">87.6%</div>
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
                <Input type="text" placeholder="Search tweets..." className="w-full" />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Classification</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hate-speech" 
                      checked={classifications.hateSpeed}
                      onCheckedChange={(checked:any) => 
                        setClassifications({...classifications, hateSpeed: checked === true})
                      } 
                    />
                    <label htmlFor="hate-speech" className="text-sm">Hate Speech</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="offensive" 
                      checked={classifications.offensive}
                      onCheckedChange={(checked:any) => 
                        setClassifications({...classifications, offensive: checked === true})
                      } 
                    />
                    <label htmlFor="offensive" className="text-sm">Offensive</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="neutral" 
                      checked={classifications.neutral}
                      onCheckedChange={(checked:any) => 
                        setClassifications({...classifications, neutral: checked === true})
                      } 
                    />
                    <label htmlFor="neutral" className="text-sm">Neutral</label>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Date Range</h3>
                <div className="space-y-2">
                  <div className="relative">
                    <Input 
                      type="text" 
                      placeholder="yyyy / mm / dd" 
                      className="w-full pl-3 pr-10"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                        <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M16 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Input 
                      type="text" 
                      placeholder="yyyy / mm / dd" 
                      className="w-full pl-3 pr-10"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                        <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M16 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
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
              </div>
              
              <Button className="w-full">Apply Filters</Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Results Panel */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex justify-between">
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export Results
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                Generate Report
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
                  {tweets.map((tweet) => (
                    <tr key={tweet.id} className="border-b last:border-b-0">
                      <td className="py-4 px-4 max-w-md">
                        <div className="line-clamp-2">{tweet.content}</div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge 
                          className={`
                            ${tweet.classification === 'Neutral' ? 'bg-green-100 text-green-800' : 
                              tweet.classification === 'Offensive' ? 'bg-orange-100 text-orange-800' : 
                                'bg-red-100 text-red-800'} 
                            hover:bg-opacity-90
                          `}
                        >
                          {tweet.classification === 'Hate' ? 'Hate' : tweet.classification}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">{tweet.confidence}%</td>
                      <td className="py-4 px-4">{tweet.timestamp}</td>
                      <td className="py-4 px-4">
                        <Button variant="ghost" size="icon" className="mx-auto">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="bg-gray-50 border-t px-4 py-3 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing 1-5 of {totalTweets} results
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
