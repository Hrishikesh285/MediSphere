import { useEffect, useRef } from 'react';

interface MedicationTrendChartProps {
  data: number[];
  timeRange: string;
}

const MedicationTrendChart = ({ data, timeRange }: MedicationTrendChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const padding = 30;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);

    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = '#E5E7EB'; // gray-200
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = '10px Arial';
    ctx.fillStyle = '#6B7280'; // gray-500
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    const yLabels = [0, 25, 50, 75, 100];
    yLabels.forEach(label => {
      const yPos = height - padding - (label / 100 * chartHeight);
      ctx.fillText(label.toString(), padding - 5, yPos);

      ctx.beginPath();
      ctx.moveTo(padding, yPos);
      ctx.lineTo(width - padding, yPos);
      ctx.strokeStyle = '#F3F4F6'; // gray-100
      ctx.stroke();
    });

    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    let xLabels: string[] = [];
    if (timeRange === 'day') {
      xLabels = ['Morning', 'Noon', 'Evening', 'Night'];
    } else if (timeRange === 'week') {
      xLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    } else {
      xLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    }
    
    const xStep = chartWidth / (xLabels.length - 1);
    xLabels.forEach((label, i) => {
      const xPos = padding + (i * xStep);
      ctx.fillText(label, xPos, height - padding + 5);
    });
    
    const dataStep = chartWidth / (data.length - 1);
    
    ctx.beginPath();
    ctx.moveTo(padding, height - padding - (data[0] / 100 * chartHeight));
    
    for (let i = 1; i < data.length; i++) {
      const x = padding + (i * dataStep);
      const y = height - padding - (data[i] / 100 * chartHeight);
      ctx.lineTo(x, y);
    }
    
    ctx.strokeStyle = '#3B82F6'; // primary-500
    ctx.lineWidth = 2;
    ctx.stroke();

    for (let i = 0; i < data.length; i++) {
      const x = padding + (i * dataStep);
      const y = height - padding - (data[i] / 100 * chartHeight);
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
  }, [data, timeRange]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width="400" 
      height="200"
      className="h-full w-full"
    />
  );
};

export default MedicationTrendChart;
