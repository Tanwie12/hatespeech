import { create } from 'zustand';
import { getApiUrl } from '@/config/api';

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
  type: 'file' | 'text';
  content?: string;
  result?: AnalysisResult;
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
  clearResults: () => Promise<void>;
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

      const response = await fetch(`${getApiUrl()}/api/upload-dataset`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      const newFile: UploadedFile = {
        id: Date.now().toString(),
        filename: file.name,
        uploadDate: new Date().toISOString(),
        status: 'processing',
        type: 'file'
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

      const response = await fetch(`${getApiUrl()}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ tweet: text.trim() })
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (!response.ok) {
        console.error('Response not OK:', response.status, result);
        throw new Error(result.error || 'Failed to analyze tweet');
      }

      // Handle the new response format where analysis results are in the analysis array
      if (!result.analysis || !Array.isArray(result.analysis) || result.analysis.length === 0) {
        console.error('Invalid or empty analysis array:', result);
        throw new Error('Invalid response format: missing analysis data');
      }

      // Use the first analysis result
      const prediction = result.analysis[0];

      if (!prediction || !prediction.label || !prediction.score) {
        console.error('Missing prediction data:', prediction);
        throw new Error('Invalid prediction data: missing required fields');
      }

      const analysisResult: AnalysisResult = {
        id: Date.now().toString(),
        text: result.tweet,
        classification: prediction.label === 'non-offensive' ? 'Neutral' : 
                       prediction.label === 'offensive' ? 'Offensive' : 'Hate',
        confidence: parseFloat(prediction.score) * 100,
        timestamp: new Date().toISOString(),
      };

      // Create a new history entry for the text analysis
      const historyEntry: UploadedFile = {
        id: analysisResult.id,
        filename: 'Text Analysis',
        uploadDate: analysisResult.timestamp,
        status: 'completed',
        type: 'text',
        content: text.trim(),
        result: analysisResult
      };

      set(state => {
        // Calculate new total and classification counts
        const newTotalAnalyzed = state.totalAnalyzed + 1;
        const newClassificationCounts = {
          ...state.classificationCounts,
          [analysisResult.classification.toLowerCase()]: state.classificationCounts[analysisResult.classification.toLowerCase() as keyof typeof state.classificationCounts] + 1
        };

        // Calculate new average confidence
        const newAverageConfidence = (
          (state.averageConfidence * state.totalAnalyzed + analysisResult.confidence) / 
          newTotalAnalyzed
        );

        return {
          results: [analysisResult, ...state.results],
          uploadedFiles: [historyEntry, ...state.uploadedFiles],
          totalAnalyzed: newTotalAnalyzed,
          classificationCounts: newClassificationCounts,
          averageConfidence: newAverageConfidence
        };
      });

      return analysisResult;
    } catch (error) {
      console.error('Analysis error details:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      set({ error: error instanceof Error ? error.message : 'Failed to analyze tweet' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchResults: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await fetch(`${getApiUrl()}/api/results`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const apiResponse: APIResponse = await response.json();
      
      if (!apiResponse.success) {
        throw new Error('API returned unsuccessful response');
      }

      // Transform API data to match our frontend format
      const results: AnalysisResult[] = apiResponse.data.map(item => ({
        id: Math.random().toString(36).substr(2, 9),
        text: item.Tweet,
        classification: item.Prediction === 'non-offensive' ? 'Neutral' : 
                       item.Prediction === 'offensive' ? 'Offensive' : 'Hate',
        confidence: parseFloat(item.Score) * 100,
        timestamp: new Date().toISOString()
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
  },

  clearResults: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await fetch(`${getApiUrl()}/api/results`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete results');
      }

      // Reset the store state
      set({
        results: [],
        totalAnalyzed: 0,
        classificationCounts: {
          neutral: 0,
          offensive: 0,
          hate: 0
        },
        averageConfidence: 0
      });

    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete results' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
})); 