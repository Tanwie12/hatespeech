import { create } from 'zustand';

interface APIResponse {
  success: boolean;
  data: {
    Tweet: string;
    Prediction: 'offensive' | 'non-offensive' | 'hate';
    Score: string;
  }[];
}

export interface AnalysisResult {
  id: string;
  text: string;
  classification: 'Neutral' | 'Offensive' | 'Hate';
  confidence: number;
  timestamp: string;
}

export interface UploadedFile {
  id: string;
  filename: string;
  uploadDate: string;
  status: 'completed' | 'processing' | 'error';
}

interface AnalysisState {
  // Analysis Results State
  results: AnalysisResult[];
  isLoading: boolean;
  error: string | null;
  
  // File Upload State
  uploadedFiles: UploadedFile[];
  isUploading: boolean;
  uploadProgress: number;
  
  // Stats
  totalAnalyzed: number;
  classificationCounts: {
    neutral: number;
    offensive: number;
    hate: number;
  };
  averageConfidence: number;

  // Actions
  uploadFile: (file: File) => Promise<void>;
  analyzeTweet: (text: string) => Promise<AnalysisResult>;
  fetchResults: () => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  clearHistory: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  // Initial State
  results: [],
  isLoading: false,
  error: null,
  uploadedFiles: [],
  isUploading: false,
  uploadProgress: 0,
  totalAnalyzed: 0,
  classificationCounts: {
    neutral: 0,
    offensive: 0,
    hate: 0,
  },
  averageConfidence: 0,

  // Actions
  uploadFile: async (file: File) => {
    try {
      set({ isUploading: true, uploadProgress: 0, error: null });
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://127.0.0.1:5000/api/upload-dataset', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      const newFile: UploadedFile = {
        id: Date.now().toString(),
        filename: file.name,
        uploadDate: new Date().toISOString(),
        status: 'processing'
      };

      set(state => ({
        uploadedFiles: [newFile, ...state.uploadedFiles]
      }));

      // After successful upload, fetch new results
      await get().fetchResults();

    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to upload file' });
      throw error;
    } finally {
      set({ isUploading: false, uploadProgress: 0 });
    }
  },

  analyzeTweet: async (text: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await fetch('http://127.0.0.1:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze tweet');
      }

      const result = await response.json();
      const analysisResult: AnalysisResult = {
        id: Date.now().toString(),
        text,
        ...result,
        timestamp: new Date().toISOString(),
      };

      set(state => ({
        results: [analysisResult, ...state.results],
        totalAnalyzed: state.totalAnalyzed + 1,
        classificationCounts: {
          ...state.classificationCounts,
          [analysisResult.classification.toLowerCase()]: state.classificationCounts[analysisResult.classification.toLowerCase() as keyof typeof state.classificationCounts] + 1
        }
      }));

      return analysisResult;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to analyze tweet' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchResults: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await fetch('http://127.0.0.1:5000/api/results');
      
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const apiResponse: APIResponse = await response.json();
      
      if (!apiResponse.success) {
        throw new Error('API returned unsuccessful response');
      }

      // Transform API data to match our frontend format
      const results: AnalysisResult[] = apiResponse.data.map(item => ({
        id: Math.random().toString(36).substr(2, 9), // Generate random ID for now
        text: item.Tweet,
        classification: item.Prediction === 'non-offensive' ? 'Neutral' : 
                       item.Prediction === 'offensive' ? 'Offensive' : 'Hate',
        confidence: parseFloat(item.Score) * 100,
        timestamp: new Date().toISOString() // Using current time as API doesn't provide timestamp
      }));
      
      // Calculate statistics
      const totalAnalyzed = results.length;
      const classificationCounts = results.reduce((acc, result) => {
        const classification = result.classification.toLowerCase() as 'neutral' | 'offensive' | 'hate';
        acc[classification] = (acc[classification] || 0) + 1;
        return acc;
      }, { neutral: 0, offensive: 0, hate: 0 });
      
      const averageConfidence = results.reduce((sum, result) => 
        sum + result.confidence, 0) / (results.length || 1);

      set({ 
        results,
        totalAnalyzed,
        classificationCounts,
        averageConfidence
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch results' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteFile: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Here you would typically call your backend to delete the file
      // For now, we'll just update the local state
      set(state => ({
        uploadedFiles: state.uploadedFiles.filter(file => file.id !== id)
      }));
      
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete file' });
    } finally {
      set({ isLoading: false });
    }
  },

  clearHistory: () => {
    set({ uploadedFiles: [] });
  }
})); 