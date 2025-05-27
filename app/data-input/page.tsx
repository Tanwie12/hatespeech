// app/data-input/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Info, Eye, Trash2, MessageSquare } from 'lucide-react';
import Breadcrumb from '@/components/layout/breadcrumb';
import { toast } from 'sonner';
import { useAnalysisStore, type UploadedFile } from '@/stores/analysis-store';
import { useDashboardStore } from '@/stores/dashboard-store';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DataInputPage() {
  const [dragActive, setDragActive] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  
  const { 
    uploadFile, 
    deleteFile, 
    clearHistory,
    uploadedFiles, 
    isUploading,
    analyzeTweet,
    isLoading
  } = useAnalysisStore();
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleUpload = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast.error('File size must be less than 50MB');
      return;
    }

    try {
      toast.promise(uploadFile(file), {
        loading: 'Uploading file...',
        success: () => {
          // Refresh dashboard data after successful upload
          useDashboardStore.getState().refreshAllData();
          return 'File uploaded successfully';
        },
        error: (err) => err instanceof Error ? err.message : 'Failed to upload file'
      });
    } catch (error) {
      console.error('Upload error:', error);
    }
  };
  
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleUpload(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleUpload(e.target.files[0]);
    }
  };
  
  const handleFileClick = () => {
    document.getElementById('file-upload')?.click();
  };

  const handleDeleteFile = async (id: string) => {
    try {
      await deleteFile(id);
      toast.success('File deleted successfully');
    } catch {
      toast.error('Failed to delete file');
    }
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to analyze');
      return;
    }

    try {
      await analyzeTweet(inputText);
      setInputText('');
      toast.success('Analysis completed successfully');
    } catch {
      toast.error('Failed to analyze text');
    }
  };

  const handleViewDetails = (file: UploadedFile) => {
    setSelectedFile(file);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb />
      
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Data Input</h1>
        <p className="text-gray-600 mt-1">Upload and manage your data for analysis</p>
      </div>
      
      {/* Text Analysis Section */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-medium mb-4">Text Analysis</h2>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter text to analyze..."
              value={inputText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value)}
              rows={4}
              className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 
                focus:border-blue-500 transition-all duration-200 resize-none"
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={isLoading || !inputText.trim()}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 
                text-white font-medium rounded-lg transition-all duration-200 
                transform hover:scale-[1.02] active:scale-[0.98]
                disabled:bg-blue-300 disabled:cursor-not-allowed disabled:transform-none
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                inline-flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  Analyze Text
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Upload Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Button 
          className="h-14 justify-start gap-2 text-sm font-normal"
          onClick={handleFileClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </div>
          ) : (
            <>
              <Upload className="h-5 w-5" />
              Upload CSV
            </>
          )}
        </Button>
        <Button variant="outline" className="h-14 justify-start gap-2 text-sm font-normal" disabled={isUploading}>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 17.5L18.5 21V17.5H22Z" fill="currentColor"/>
            <path d="M15 7V5C15 3.89543 14.1046 3 13 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M17.5 13H22M22 13V8M22 13L19 10M7 8H11M7 12H11M7 16H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Stream Tweets
        </Button>
      </div>
      
      {/* File Drop Zone */}
      <div 
        className={`border-2 border-dashed rounded-lg p-10 mb-6 flex flex-col items-center justify-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".csv"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-center text-gray-800 font-medium">Uploading file...</p>
            <p className="text-center text-gray-500 text-sm">Please wait while we process your file</p>
          </div>
        ) : (
          <>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400 mb-4">
              <path d="M12 16V8M12 8L8 12M12 8L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <p className="text-center text-gray-800 font-medium mb-1">Drag and drop your CSV file here, or click to browse</p>
            <p className="text-center text-gray-500 text-sm">Supported file type: CSV up to 50MB</p>
          </>
        )}
      </div>
      
      {/* File Guidelines */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-medium mb-4">File Guidelines</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <FileText className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">File Format</h3>
                <p className="text-gray-600 text-sm">Must be a valid CSV file with proper column headers</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Data Requirements</h3>
                <p className="text-gray-600 text-sm">Ensure all required columns are present and properly formatted</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Upload History */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Upload History</h2>
          
          {uploadedFiles.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearHistory}>
              Clear All
            </Button>
          )}
        </div>
        
        {uploadedFiles.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Content</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Upload Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploadedFiles.map((file) => (
                  <tr key={file.id} className="border-b last:border-b-0">
                    <td className="py-3 px-4">
                      {file.type === 'file' ? (
                        <FileText className="h-4 w-4 text-gray-500" />
                      ) : (
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="line-clamp-1">
                        {file.type === 'file' ? file.filename : file.content}
                      </div>
                    </td>
                    <td className="py-3 px-4">{new Date(file.uploadDate).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={file.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleViewDetails(file)}
                          className="hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4 text-gray-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteFile(file.id)}
                          className="hover:bg-gray-100"
                        >
                          <Trash2 className="h-4 w-4 text-gray-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <p className="text-gray-500 mb-2">No upload history available</p>
              <p className="text-gray-400 text-sm">Uploaded files and analyzed text will appear here</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Details Dialog */}
      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Analysis Details</DialogTitle>
          </DialogHeader>
          {selectedFile?.type === 'text' && selectedFile.result && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Content</h4>
                <p className="text-gray-600 text-sm">{selectedFile.content}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Classification</h4>
                <Badge 
                  className={`
                    ${selectedFile.result.classification === 'Neutral' ? 'bg-green-100 text-green-800' : 
                      selectedFile.result.classification === 'Hate' ? 'bg-orange-100 text-orange-800' : 
                        'bg-red-100 text-red-800'} 
                  `}
                >
                  {selectedFile.result.classification}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Confidence</h4>
                <p className="text-gray-600 text-sm">{selectedFile.result.confidence.toFixed(1)}%</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Timestamp</h4>
                <p className="text-gray-600 text-sm">
                  {new Date(selectedFile.result.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          )}
          {selectedFile?.type === 'file' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Filename</h4>
                <p className="text-gray-600 text-sm">{selectedFile.filename}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Upload Date</h4>
                <p className="text-gray-600 text-sm">
                  {new Date(selectedFile.uploadDate).toLocaleString()}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Status</h4>
                <StatusBadge status={selectedFile.status} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button>Process Data</Button>
      </div>
    </div>
  );
}

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Completed
      </Badge>;
    case 'processing':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-blue-500"></span> Processing
      </Badge>;
    case 'error':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-red-500"></span> Error
      </Badge>;
    default:
      return null;
  }
};
