// components/dashboard/trend-chart.tsx
'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { TrendData } from '@/types';

Chart.register(...registerables);

interface TrendChartProps {
  data: TrendData;
}

export default function TrendChart({ data }: TrendChartProps) {
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
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Neutral',
            data: data.neutral,
            borderColor: '#e77d55',
            backgroundColor: 'transparent',
            pointBackgroundColor: '#e77d55',
            tension: 0.4
          },
          {
            label: 'Offensive',
            data: data.offensive,
            borderColor: '#2db5a9',
            backgroundColor: 'transparent',
            pointBackgroundColor: '#2db5a9',
            tension: 0.4
          },
          {
            label: 'Hate',
            data: data.hate,
            borderColor: '#2c3e50',
            backgroundColor: 'transparent',
            pointBackgroundColor: '#2c3e50',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              drawOnChartArea: true,
              drawTicks: false,
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              stepSize: 20
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
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
}
