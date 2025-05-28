'use client';

import { useState } from 'react';

import { 
  BookOpen, 
  Upload, 
  BarChart2, 
  MessageSquare,
  ChevronRight,
  ChevronDown,
  Code,
  Shield,
} from 'lucide-react';

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState<string | null>('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <BookOpen className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Welcome to HateSpeech Guard</h3>
          <p className="text-gray-600">
            HateSpeech Guard is an AI-powered platform designed to detect and analyze hate speech in text content.
            This documentation will guide you through using our platform effectively.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Quick Start</h4>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Navigate to the Data Input page</li>
              <li>Enter text or upload a CSV file</li>
              <li>View results in the Dashboard</li>
              <li>Generate reports as needed</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: 'text-analysis',
      title: 'Text Analysis',
      icon: <MessageSquare className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Analyzing Individual Text</h3>
          <p className="text-gray-600">
            Our platform allows you to analyze individual pieces of text for hate speech content.
          </p>
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">How to Analyze Text:</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Go to the Data Input page</li>
              <li>Enter your text in the text area</li>
              <li>Click &quot;Analyze Text&quot;</li>
              <li>View the results showing classification and confidence score</li>
            </ol>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Understanding Results:</h5>
              <ul className="space-y-2 text-gray-600">
                <li><span className="font-medium">Neutral:</span> Content is free of hate speech</li>
                <li><span className="font-medium">Offensive:</span> Content contains offensive language</li>
                <li><span className="font-medium">Hate:</span> Content contains hate speech</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'bulk-analysis',
      title: 'Bulk Analysis',
      icon: <Upload className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Bulk Content Analysis</h3>
          <p className="text-gray-600">
            Process multiple entries at once using CSV file uploads.
          </p>
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">CSV File Requirements:</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>File must be in CSV format</li>
              <li>Maximum file size: 50MB</li>
              <li>Each row should contain one text entry</li>
              <li>File should have a header row</li>
            </ul>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Example CSV Format:</h5>
              <pre className="bg-gray-100 p-2 rounded text-sm">
                text{'\n'}
                &quot;This is the first entry&quot;{'\n'}
                &quot;This is the second entry&quot;
              </pre>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <BarChart2 className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Understanding the Dashboard</h3>
          <p className="text-gray-600">
            The dashboard provides comprehensive insights into your content analysis results.
          </p>
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Key Metrics:</h4>
            <ul className="space-y-2 text-gray-600">
              <li><span className="font-medium">Total Tweets Analyzed:</span> Overall count of analyzed content</li>
              <li><span className="font-medium">Hate Speech Content:</span> Percentage of content classified as hate speech</li>
              <li><span className="font-medium">System Risk Level:</span> Overall assessment of content risk</li>
            </ul>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Charts and Visualizations:</h5>
              <ul className="space-y-2 text-gray-600">
                <li>Classification Distribution: Shows the breakdown of content classifications</li>
                <li>7-Day Trend: Displays analysis trends over time</li>
                <li>Recent Activity: Lists the latest analyzed content</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'api',
      title: 'API Integration',
      icon: <Code className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">API Documentation</h3>
          <p className="text-gray-600">
            Integrate HateSpeech Guard into your applications using our REST API.
          </p>
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Endpoints:</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Analyze Single Text</h5>
                <pre className="bg-gray-100 p-2 rounded text-sm">
                  POST /api/analyze{'\n'}
                  Content-Type: application/json{'\n\n'}
                  {'{'}
                    &quot;tweet&quot;: &quot;text to analyze&quot;
                  {'}'}
                </pre>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Response Format:</h5>
                <pre className="bg-gray-100 p-2 rounded text-sm">
                  {'{'}
                    &quot;success&quot;: true,
                    &quot;data&quot;: {'{'}
                      &quot;tweet&quot;: {'{'}
                        &quot;tweet&quot;: &quot;original text&quot;,
                        &quot;label&quot;: &quot;classification&quot;,
                        &quot;score&quot;: &quot;confidence&quot;
                      {'}'}
                    {'}'}
                  {'}'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: <Shield className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Security Measures</h3>
          <p className="text-gray-600">
            We take security and privacy seriously. Here&apos;s how we protect your data:
          </p>
          <div className="space-y-4">
            <ul className="space-y-2 text-gray-600">
              <li>All data is encrypted in transit and at rest</li>
              <li>Regular security audits and updates</li>
              <li>No data sharing with third parties</li>
              <li>Compliance with data protection regulations</li>
            </ul>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Data Retention:</h5>
              <p className="text-gray-600">
                Analysis results are stored for 30 days by default. You can request immediate deletion
                of your data through the dashboard.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-900">Documentation</h1>
          </div>
          <p className="text-gray-600">
            Learn how to use HateSpeech Guard effectively
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-8">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {section.icon}
                    <span>{section.title}</span>
                    {activeSection === section.id ? (
                      <ChevronDown className="h-4 w-4 ml-auto" />
                    ) : (
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              {sections.find(s => s.id === activeSection)?.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 