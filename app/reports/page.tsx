// app/reports/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Download, Share, Trash2, Calendar, Search, ChevronLeft, ChevronRight
} from 'lucide-react';
import Breadcrumb from '@/components/layout/breadcrumb';
import { useAnalysisStore } from '@/stores/analysis-store';
import { toast } from 'sonner';
import { generatePDF, generateExcel, generateCSV, generateJSON } from '@/utils/report-generators';
import { Badge } from '@/components/ui/badge';
import type { AnalysisResult } from '@/stores/analysis-store';

type ReportFormat = 'PDF' | 'Excel' | 'CSV' | 'JSON';

interface ReportItem {
  id: string;
  name: string;
  type: 'Summary' | 'Detailed' | 'Trend';
  date: string;
  size: string;
  format: ReportFormat;
}

const ReportPreview = ({ 
  reportType,
  dateRange,
  confidenceThreshold,
  visualizations,
  results,
  totalAnalyzed,
  classificationCounts,
  averageConfidence
}: {
  reportType: string;
  dateRange: { start: string; end: string };
  confidenceThreshold: number[];
  visualizations: Record<string, boolean>;
  results: AnalysisResult[];
  totalAnalyzed: number;
  classificationCounts: { neutral: number; offensive: number; hate: number };
  averageConfidence: number;
}) => {
  const filteredResults = results.filter(tweet => tweet.confidence >= confidenceThreshold[0]);

  return (
    <div className="border rounded-lg h-96 overflow-auto bg-white p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-xl font-semibold">
            {reportType === 'summary' ? 'Classification Summary Report' : 'Detailed Analysis Report'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {dateRange.start || 'All time'} - {dateRange.end || 'Present'}
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <div className="text-sm text-gray-500">Total Analyzed</div>
            <div className="text-2xl font-semibold mt-1">{totalAnalyzed.toLocaleString()}</div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="text-sm text-gray-500">Average Confidence</div>
            <div className="text-2xl font-semibold mt-1">{averageConfidence.toFixed(1)}%</div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="text-sm text-gray-500">Confidence Threshold</div>
            <div className="text-2xl font-semibold mt-1">{confidenceThreshold[0]}%</div>
          </div>
        </div>

        {/* Distribution */}
        {visualizations.distribution && (
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3">Classification Distribution</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Neutral</span>
                </div>
                <span className="text-sm font-medium">
                  {((classificationCounts.neutral / totalAnalyzed) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm">Offensive</span>
                </div>
                <span className="text-sm font-medium">
                  {((classificationCounts.offensive / totalAnalyzed) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Hate</span>
                </div>
                <span className="text-sm font-medium">
                  {((classificationCounts.hate / totalAnalyzed) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Results Preview */}
        <div>
          <h4 className="text-sm font-medium mb-3">Results Preview</h4>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left py-2 px-4 text-xs font-medium text-gray-600">Text</th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-gray-600 w-28">Classification</th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-gray-600 w-24">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.slice(0, 3).map((result, index) => (
                  <tr key={index} className="border-b last:border-b-0">
                    <td className="py-2 px-4">
                      <div className="text-sm line-clamp-1">{result.text}</div>
                    </td>
                    <td className="py-2 px-4">
                      <Badge 
                        className={`
                          ${result.classification === 'Neutral' ? 'bg-green-100 text-green-800' : 
                            result.classification === 'Offensive' ? 'bg-orange-100 text-orange-800' : 
                              'bg-red-100 text-red-800'} 
                          hover:bg-opacity-90
                        `}
                      >
                        {result.classification}
                      </Badge>
                    </td>
                    <td className="py-2 px-4">
                      <span className="text-sm">{result.confidence.toFixed(1)}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredResults.length > 3 && (
              <div className="bg-gray-50 border-t px-4 py-2 text-xs text-gray-500">
                And {filteredResults.length - 3} more results...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ReportsPage() {
  // Analysis store state
  const { 
    results,
    totalAnalyzed,
    classificationCounts,
    averageConfidence,
    isLoading,
    fetchResults
  } = useAnalysisStore();

  // Local state
  const [confidenceThreshold, setConfidenceThreshold] = useState([70]);
  const [selectedReportType, setSelectedReportType] = useState<'summary' | 'detailed'>('summary');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedFormat, setSelectedFormat] = useState<Lowercase<ReportFormat>>('pdf');
  const [searchQuery, setSearchQuery] = useState('');
  const [visualizations, setVisualizations] = useState<Record<'distribution' | 'timeSeries' | 'wordCloud' | 'geographic', boolean>>({
    distribution: true,
    timeSeries: false,
    wordCloud: false,
    geographic: false
  });
  
  const [reports, setReports] = useState<ReportItem[]>([
    {
      id: '1',
      name: 'Weekly Classification Summary',
      type: 'Summary',
      date: '2024-02-10',
      size: '2.4 MB',
      format: 'PDF'
    },
    {
      id: '2',
      name: 'January Detailed Analysis',
      type: 'Detailed',
      date: '2024-02-09',
      size: '4.8 MB',
      format: 'Excel'
    },
    {
      id: '3',
      name: 'Q4 Trend Report',
      type: 'Trend',
      date: '2024-02-08',
      size: '1.7 MB',
      format: 'PDF'
    }
  ]);

  // Fetch results on mount
  useEffect(() => {
    fetchResults().catch(() => {
      toast.error('Failed to fetch analysis results');
    });
  }, [fetchResults]);

  const handleGenerateReport = () => {
    try {
      // Create report content based on selected type
      const reportContent = {
        title: selectedReportType === 'summary' ? 'Classification Summary Report' : 'Detailed Analysis Report',
        generatedAt: new Date().toLocaleString(),
        dateRange: {
          start: dateRange.start || 'All time',
          end: dateRange.end || 'All time'
        },
        confidenceThreshold: confidenceThreshold[0] + '%',
        summary: {
          totalAnalyzed,
          averageConfidence: averageConfidence.toFixed(1) + '%',
          distribution: {
            neutral: ((classificationCounts.neutral / totalAnalyzed) * 100).toFixed(1) + '%',
            offensive: ((classificationCounts.offensive / totalAnalyzed) * 100).toFixed(1) + '%',
            hate: ((classificationCounts.hate / totalAnalyzed) * 100).toFixed(1) + '%'
          }
        },
        visualizations: Object.entries(visualizations)
          .filter(([, enabled]) => enabled)
          .map(([type]) => type),
        results: results.filter(tweet => tweet.confidence >= confidenceThreshold[0])
          .map(tweet => ({
            text: tweet.text,
            classification: tweet.classification,
            confidence: tweet.confidence.toFixed(1) + '%',
            timestamp: new Date(tweet.timestamp).toLocaleString()
          }))
      };

      // Generate file based on selected format
      let blob: Blob;
      let extension: string;

      switch (selectedFormat) {
        case 'pdf':
          blob = generatePDF(reportContent);
          extension = 'pdf';
          break;
        case 'excel':
          blob = generateExcel(reportContent);
          extension = 'xlsx';
          break;
        case 'csv':
          blob = generateCSV(reportContent);
          extension = 'csv';
          break;
        case 'json':
          blob = generateJSON(reportContent);
          extension = 'json';
          break;
        default:
          throw new Error('Unsupported format');
      }

      // Download the file
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hate-speech-report-${new Date().toISOString().split('T')[0]}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Add to reports history
      const newReport: ReportItem = {
        id: Date.now().toString(),
        name: reportContent.title,
        type: selectedReportType === 'summary' ? 'Summary' : 'Detailed',
        date: new Date().toISOString().split('T')[0],
        size: `${(blob.size / 1024).toFixed(1)} KB`,
        format: selectedFormat.toUpperCase() as ReportFormat
      };

      setReports(prev => [newReport, ...prev]);
      toast.success('Report generated successfully');
    } catch (err) {
      console.error('Report generation error:', err);
      toast.error('Failed to generate report');
    }
  };

  const handleDeleteReport = (id: string) => {
    setReports(prev => prev.filter(report => report.id !== id));
    toast.success('Report deleted successfully');
  };

  const handleDownloadReport = (report: ReportItem) => {
    // In a real app, this would download from storage/server
    toast.success(`Downloading ${report.name}`);
  };

  const handleShareReport = (report: ReportItem) => {
    // In a real app, this would open a share dialog
    toast.success(`Sharing ${report.name}`);
  };

  const filteredReports = reports.filter(report =>
    report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb />
      
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Generate and download analysis reports of classified tweets</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration Panel */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-medium mb-6">Report Configuration</h2>
            
            <div className="space-y-6">
              {/* Report Type */}
              <div>
                <h3 className="text-sm font-medium mb-3">Report Type</h3>
                <div className="flex border rounded-md overflow-hidden">
                  <button 
                    className={`flex-1 py-2 px-4 text-sm ${selectedReportType === 'summary' ? 'bg-gray-100 font-medium' : 'bg-white'}`}
                    onClick={() => setSelectedReportType('summary')}
                  >
                    Classification Summary
                  </button>
                  <button 
                    className={`flex-1 py-2 px-4 text-sm ${selectedReportType === 'detailed' ? 'bg-gray-100 font-medium' : 'bg-white'}`}
                    onClick={() => setSelectedReportType('detailed')}
                  >
                    Detailed Analysis
                  </button>
                </div>
              </div>
              
              {/* Date Range */}
              <div>
                <h3 className="text-sm font-medium mb-3">Date Range</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="w-full pl-10"
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                  <div className="relative">
                    <Input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="w-full pl-10"
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>
              
              {/* Visualizations */}
              <div>
                <h3 className="text-sm font-medium mb-3">Visualizations</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border rounded-md p-3 flex items-center gap-2">
                    <Checkbox 
                      id="distribution" 
                      checked={visualizations.distribution}
                      onCheckedChange={(checked) => 
                        setVisualizations(prev => ({ ...prev, distribution: checked === true }))
                      }
                    />
                    <label htmlFor="distribution" className="text-sm flex items-center gap-1.5">
                      Distribution
                    </label>
                  </div>
                  <div className="border rounded-md p-3 flex items-center gap-2">
                    <Checkbox 
                      id="time-series"
                      checked={visualizations.timeSeries}
                      onCheckedChange={(checked) => 
                        setVisualizations(prev => ({ ...prev, timeSeries: checked === true }))
                      }
                    />
                    <label htmlFor="time-series" className="text-sm flex items-center gap-1.5">
                      Time Series
                    </label>
                  </div>
                  <div className="border rounded-md p-3 flex items-center gap-2">
                    <Checkbox 
                      id="word-cloud"
                      checked={visualizations.wordCloud}
                      onCheckedChange={(checked) => 
                        setVisualizations(prev => ({ ...prev, wordCloud: checked === true }))
                      }
                    />
                    <label htmlFor="word-cloud" className="text-sm flex items-center gap-1.5">
                      Word Cloud
                    </label>
                  </div>
                  <div className="border rounded-md p-3 flex items-center gap-2">
                    <Checkbox 
                      id="geographic"
                      checked={visualizations.geographic}
                      onCheckedChange={(checked) => 
                        setVisualizations(prev => ({ ...prev, geographic: checked === true }))
                      }
                    />
                    <label htmlFor="geographic" className="text-sm flex items-center gap-1.5">
                      Geographic
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Confidence Score Threshold */}
              <div>
                <h3 className="text-sm font-medium mb-3">Confidence Score Threshold</h3>
                <div className="px-1">
                  <Slider
                    value={confidenceThreshold}
                    onValueChange={setConfidenceThreshold}
                    max={100}
                    step={1}
                    className="mb-1"
                  />
                  <div className="text-sm text-gray-500 text-center">
                    {confidenceThreshold}% or higher
                  </div>
                </div>
              </div>
              
              {/* Output Format */}
              <div>
                <h3 className="text-sm font-medium mb-3">Output Format</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={selectedFormat === 'pdf' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedFormat('pdf')}
                    className={`flex items-center justify-center gap-2 ${
                      selectedFormat === 'pdf' ? 'bg-blue-600 text-white' : ''
                    }`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 18H17V16H7V18Z" fill="currentColor"/>
                      <path d="M17 14H7V12H17V14Z" fill="currentColor"/>
                      <path d="M7 10H11V8H7V10Z" fill="currentColor"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M6 2C4.34315 2 3 3.34315 3 5V19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19V9C21 5.13401 17.866 2 14 2H6ZM6 4H13V9H19V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5C5 4.44772 5.44772 4 6 4ZM15 4.10002C16.6113 4.4271 17.9413 5.52906 18.584 7H15V4.10002Z" fill="currentColor"/>
                    </svg>
                    PDF
                  </Button>
                  <Button 
                    variant={selectedFormat === 'csv' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedFormat('csv')}
                    className={`flex items-center justify-center gap-2 ${
                      selectedFormat === 'csv' ? 'bg-blue-600 text-white' : ''
                    }`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM12 17V15H8V13H12V11L16 14L12 17Z" fill="currentColor"/>
                    </svg>
                    CSV
                  </Button>
                  <Button 
                    variant={selectedFormat === 'json' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedFormat('json')}
                    className={`flex items-center justify-center gap-2 ${
                      selectedFormat === 'json' ? 'bg-blue-600 text-white' : ''
                    }`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M4 2H20C21.1046 2 22 2.89543 22 4V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V4C2 2.89543 2.89543 2 4 2ZM4 4V20H20V4H4ZM8 7H6V9H8V7ZM10 7H18V9H10V7ZM6 11H8V13H6V11ZM18 11H10V13H18V11ZM8 15H6V17H8V15ZM10 15H18V17H10V15Z" fill="currentColor"/>
                    </svg>
                    JSON
                  </Button>
                  <Button 
                    variant={selectedFormat === 'excel' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedFormat('excel')}
                    className={`flex items-center justify-center gap-2 ${
                      selectedFormat === 'excel' ? 'bg-blue-600 text-white' : ''
                    }`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.17 3H14V5H19V19H14V21H21.17C21.9 21 22.5 20.4 22.5 19.67V4.33C22.5 3.6 21.9 3 21.17 3Z" fill="currentColor"/>
                      <path d="M15.17 7H8V9H13V15H8V17H15.17C15.9 17 16.5 16.4 16.5 15.67V8.33C16.5 7.6 15.9 7 15.17 7Z" fill="currentColor"/>
                      <path d="M9.17 11H2V13H7V19H2V21H9.17C9.9 21 10.5 20.4 10.5 19.67V12.33C10.5 11.6 9.9 11 9.17 11Z" fill="currentColor"/>
                    </svg>
                    Excel
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selected format: <span className="font-medium">{selectedFormat.toUpperCase()}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Preview and History Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Preview */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Report Preview</h2>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setConfidenceThreshold([70]);
                    setSelectedReportType('summary');
                    setDateRange({ start: '', end: '' });
                    setSelectedFormat('pdf');
                    setVisualizations({
                      distribution: true,
                      timeSeries: false,
                      wordCloud: false,
                      geographic: false
                    });
                  }}
                >
                  Reset
                </Button>
                <Button variant="outline" size="sm">Save Configuration</Button>
                <Button 
                  size="sm"
                  onClick={handleGenerateReport}
                  disabled={isLoading}
                >
                  Generate Report
                </Button>
              </div>
            </div>
            
            <ReportPreview
              reportType={selectedReportType}
              dateRange={dateRange}
              confidenceThreshold={confidenceThreshold}
              visualizations={visualizations}
              results={results}
              totalAnalyzed={totalAnalyzed}
              classificationCounts={classificationCounts}
              averageConfidence={averageConfidence}
            />
          </div>
          
          {/* Report History */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Report History</h2>
              <div className="w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search reports..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Report Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Size</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Format</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="border-b last:border-b-0">
                      <td className="py-3 px-4">{report.name}</td>
                      <td className="py-3 px-4">{report.type}</td>
                      <td className="py-3 px-4">{report.date}</td>
                      <td className="py-3 px-4">{report.size}</td>
                      <td className="py-3 px-4">{report.format}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleDownloadReport(report)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleShareReport(report)}
                          >
                            <Share className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleDeleteReport(report.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 border-t">
                    <td colSpan={6} className="py-2 px-4 text-sm text-gray-500 flex justify-between items-center">
                      <span>Showing {filteredReports.length} of {reports.length} reports</span>
                      <div className="flex gap-1">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
