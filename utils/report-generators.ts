import { utils, writeFile } from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface ReportData {
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

export const generatePDF = (data: ReportData): Blob => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Title
  doc.setFontSize(20);
  doc.text(data.title, pageWidth / 2, 20, { align: 'center' });

  // Metadata
  doc.setFontSize(10);
  doc.text(`Generated: ${data.generatedAt}`, 20, 35);
  doc.text(`Date Range: ${data.dateRange.start} - ${data.dateRange.end}`, 20, 42);
  doc.text(`Confidence Threshold: ${data.confidenceThreshold}`, 20, 49);

  // Summary Section
  doc.setFontSize(14);
  doc.text('Summary', 20, 65);
  doc.setFontSize(10);
  doc.text(`Total Analyzed: ${data.summary.totalAnalyzed}`, 25, 75);
  doc.text(`Average Confidence: ${data.summary.averageConfidence}`, 25, 82);

  // Distribution
  doc.text('Classification Distribution:', 25, 92);
  doc.text(`Neutral: ${data.summary.distribution.neutral}`, 30, 99);
  doc.text(`Offensive: ${data.summary.distribution.offensive}`, 30, 106);
  doc.text(`Hate: ${data.summary.distribution.hate}`, 30, 113);

  // Results Table
  doc.setFontSize(14);
  doc.text('Detailed Results', 20, 130);

  const tableData = data.results.map(result => [
    result.text.substring(0, 50) + (result.text.length > 50 ? '...' : ''),
    result.classification,
    result.confidence,
    result.timestamp
  ]);

  (doc as any).autoTable({
    startY: 140,
    head: [['Text', 'Classification', 'Confidence', 'Timestamp']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [66, 66, 66] },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 35 },
      2: { cellWidth: 30 },
      3: { cellWidth: 45 }
    }
  });

  return doc.output('blob');
};

export const generateExcel = (data: ReportData): Blob => {
  const wb = utils.book_new();

  // Summary Sheet
  const summaryData = [
    ['Report Information'],
    ['Title', data.title],
    ['Generated At', data.generatedAt],
    ['Date Range', `${data.dateRange.start} - ${data.dateRange.end}`],
    ['Confidence Threshold', data.confidenceThreshold],
    [],
    ['Summary Statistics'],
    ['Total Analyzed', data.summary.totalAnalyzed],
    ['Average Confidence', data.summary.averageConfidence],
    [],
    ['Classification Distribution'],
    ['Neutral', data.summary.distribution.neutral],
    ['Offensive', data.summary.distribution.offensive],
    ['Hate', data.summary.distribution.hate],
  ];

  const summaryWS = utils.aoa_to_sheet(summaryData);
  utils.book_append_sheet(wb, summaryWS, 'Summary');

  // Results Sheet
  const resultsData = [
    ['Text', 'Classification', 'Confidence', 'Timestamp'],
    ...data.results.map(result => [
      result.text,
      result.classification,
      result.confidence,
      result.timestamp
    ])
  ];

  const resultsWS = utils.aoa_to_sheet(resultsData);
  utils.book_append_sheet(wb, resultsWS, 'Detailed Results');

  // Convert to array buffer
  const wbout = writeFile(wb, 'xlsx');
  const buffer = new ArrayBuffer(wbout.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < wbout.length; i++) view[i] = wbout.charCodeAt(i) & 0xFF;
  
  return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

export const generateCSV = (data: ReportData): Blob => {
  const headers = ['Text', 'Classification', 'Confidence', 'Timestamp'];
  const csvContent = [
    headers.join(','),
    ...data.results.map(r => 
      [
        `"${r.text.replace(/"/g, '""')}"`,
        r.classification,
        r.confidence,
        r.timestamp
      ].join(',')
    )
  ].join('\n');

  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
};

export const generateJSON = (data: ReportData): Blob => {
  return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
}; 