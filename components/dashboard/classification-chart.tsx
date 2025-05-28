// components/dashboard/classification-chart.tsx
'use client';

import { memo, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { ClassificationData } from '@/types';

Chart.register(...registerables);

interface ClassificationChartProps {
  data: ClassificationData;
}

const ClassificationChart = memo(function ClassificationChart({ data }: ClassificationChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Neutral', 'Hate', 'Hate Speech'],
        datasets: [{
          data: [
            data.neutral,
            data.offensive,
            data.hate
          ],
          backgroundColor: [
            '#e77d55', // neutral (orange)
            '#2db5a9', // hate (teal)
            '#2c3e50'  // hate speech (dark blue)
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              font: {
                size: 12
              }
            }
          }
        }
      }
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);
  
  return (
    <div className="h-[300px] w-full">
      <canvas ref={chartRef} />
    </div>
  );
});

export default ClassificationChart;
