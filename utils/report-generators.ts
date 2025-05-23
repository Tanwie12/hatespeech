import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { UserOptions } from 'jspdf-autotable';

interface ReportContent {
  title: string;
  generatedAt: string;
  dateRange: {
    start: string;
    end: string;
  };
  confidenceThreshold: string;
  summary: {
    totalAnalyzed: number;
    averageConfidence: string;
    distribution: {
      neutral: string;
      offensive: string;
      hate: string;
    };
  };
  visualizations: string[];
  results: Array<{
    text: string;
    classification: string;
    confidence: string;
    timestamp: string;
  }>;
}

export const generatePDF = (content: ReportContent): Blob => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(content.title, 20, 20);
  
  // Add metadata
  doc.setFontSize(10);
  doc.text(`Generated: ${content.generatedAt}`, 20, 30);
  doc.text(`Date Range: ${content.dateRange.start} - ${content.dateRange.end}`, 20, 35);
  doc.text(`Confidence Threshold: ${content.confidenceThreshold}`, 20, 40);
  
  // Add summary section
  doc.setFontSize(14);
  doc.text('Summary', 20, 50);
  
  doc.setFontSize(10);
  const summaryData = [
    ['Total Analyzed', content.summary.totalAnalyzed.toString()],
    ['Average Confidence', content.summary.averageConfidence],
    ['Neutral', content.summary.distribution.neutral],
    ['Offensive', content.summary.distribution.offensive],
    ['Hate Speech', content.summary.distribution.hate]
  ];
  
  (doc as any).autoTable({
    startY: 55,
    head: [['Metric', 'Value']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202] }
  });
  
  // Add results table
  doc.setFontSize(14);
  doc.text('Analysis Results', 20, (doc as any).lastAutoTable.finalY + 20);
  
  const resultsData = content.results.map(result => [
    result.text.substring(0, 50) + (result.text.length > 50 ? '...' : ''),
    result.classification,
    result.confidence,
    result.timestamp
  ]);
  
  (doc as any).autoTable({
    startY: (doc as any).lastAutoTable.finalY + 25,
    head: [['Text', 'Classification', 'Confidence', 'Timestamp']],
    body: resultsData,
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202] },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 40 },
      2: { cellWidth: 30 },
      3: { cellWidth: 40 }
    }
  });
  
  return doc.output('blob');
};

export const generateCSV = (content: ReportContent): Blob => {
  const headers = ['Text', 'Classification', 'Confidence', 'Timestamp'];
  const rows = content.results.map(result => [
    `"${result.text.replace(/"/g, '""')}"`,
    result.classification,
    result.confidence,
    result.timestamp
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
};

export const generateJSON = (content: ReportContent): Blob => {
  return new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
};

export const generateExcel = (content: ReportContent): Blob => {
  // For now, we'll just return a CSV as Excel format
  // In a real application, you'd want to use a proper Excel library like xlsx
  return generateCSV(content);
}; 