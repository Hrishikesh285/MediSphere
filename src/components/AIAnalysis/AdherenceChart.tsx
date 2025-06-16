import { useEffect, useRef } from 'react';

interface AdherenceChartProps {
  percentage: number;
}

const AdherenceChart = ({ percentage }: AdherenceChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 160;
    canvas.height = 160;
    
    // Calculate color
    let color;
    if (percentage >= 90) {
      color = '#16A34A'; // success-600
    } else if (percentage >= 70) {
      color = '#F59E0B'; // warning-500
    } else {
      color = '#EF4444'; // error-500
    }
    
    // Calculate end angle
    const startAngle = -0.5 * Math.PI; // Start at top
    const endAngle = startAngle + (percentage / 100) * 2 * Math.PI;
    
    // Draw background circle
    ctx.beginPath();
    ctx.arc(80, 80, 60, 0, 2 * Math.PI);
    ctx.strokeStyle = '#E5E7EB'; // gray-200
    ctx.lineWidth = 12;
    ctx.stroke();
    
    // Draw progress arc with animation
    let currentPercentage = 0;
    const animate = () => {
      if (currentPercentage >= percentage) return;
      
      currentPercentage += 2;
      if (currentPercentage > percentage) {
        currentPercentage = percentage;
      }
      
      const currentEndAngle = startAngle + (currentPercentage / 100) * 2 * Math.PI;
      
      // Clear the canvas and redraw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background circle
      ctx.beginPath();
      ctx.arc(80, 80, 60, 0, 2 * Math.PI);
      ctx.strokeStyle = '#E5E7EB';
      ctx.lineWidth = 12;
      ctx.stroke();
      
      // Draw progress arc
      ctx.beginPath();
      ctx.arc(80, 80, 60, startAngle, currentEndAngle);
      ctx.strokeStyle = color;
      ctx.lineWidth = 12;
      ctx.stroke();
      
      if (currentPercentage < percentage) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
    
  }, [percentage]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width="160" 
      height="160"
      className="h-full w-full"
    />
  );
};

export default AdherenceChart;