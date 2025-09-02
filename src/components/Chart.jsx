import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Componente Chart reutilizable para mostrar gráficos de sensores
 * Utiliza Chart.js para renderizar gráficos de líneas con tema espacial
 */
const Chart = ({ 
  data, 
  label, 
  color, 
  icon, 
  currentValue, 
  unit, 
  isMultiLine = false 
}) => {
  const chartRef = useRef(null);

  // Configurar datos del gráfico
  const chartData = {
    labels: isMultiLine 
      ? [...new Set(data.map(item => new Date(item.timestamp).toLocaleTimeString()))]
      : data.map(item => new Date(item.timestamp).toLocaleTimeString()),
    datasets: isMultiLine ? [
      {
        label: 'Roll',
        data: data.filter(item => item.type === 'Roll').map(item => item.value),
        borderColor: '#ff0000',
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#ff0000',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1,
        pointRadius: 3
      },
      {
        label: 'Pitch',
        data: data.filter(item => item.type === 'Pitch').map(item => item.value),
        borderColor: '#00ff00',
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#00ff00',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1,
        pointRadius: 3
      },
      {
        label: 'Yaw',
        data: data.filter(item => item.type === 'Yaw').map(item => item.value),
        borderColor: '#0000ff',
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#0000ff',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1,
        pointRadius: 3
      }
    ] : [
      {
        label: label,
        data: data.map(item => item.value),
        borderColor: color,
        backgroundColor: `${color}20`,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: color,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1,
        pointRadius: 3,
        pointHoverRadius: 5
      }
    ]
  };

  // Configuración del gráfico con tema espacial
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: isMultiLine,
        position: 'top',
        labels: {
          color: 'hsl(var(--foreground))',
          font: {
            family: 'Orbitron, monospace',
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'hsl(var(--primary))',
        borderWidth: 1,
        titleFont: {
          family: 'Orbitron, monospace'
        },
        bodyFont: {
          family: 'Orbitron, monospace'
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'var(--chart-grid-color)',
          borderColor: 'hsl(var(--primary))'
        },
        ticks: {
          color: 'hsl(var(--foreground))',
          font: {
            family: 'Orbitron, monospace',
            size: 10
          },
          maxTicksLimit: 6
        }
      },
      y: {
        grid: {
          color: 'var(--chart-grid-color)',
          borderColor: 'hsl(var(--primary))'
        },
        ticks: {
          color: 'hsl(var(--foreground))',
          font: {
            family: 'Orbitron, monospace',
            size: 10
          }
        }
      }
    },
    elements: {
      point: {
        hoverBackgroundColor: '#ffffff'
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <motion.div 
      className="bg-card border-2 border-primary rounded-lg overflow-hidden space-glow chart-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Encabezado del gráfico */}
      <div className="bg-card border-b border-primary p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-primary mr-3">{icon}</span>
            <h3 className="text-lg font-bold text-card-foreground">{label}</h3>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-card-foreground font-mono">
              {typeof currentValue === 'number' ? currentValue.toFixed(1) : currentValue}
              <span className="text-sm text-muted-foreground ml-1">{unit}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Área del gráfico */}
      <div className="p-4">
        <div className="h-48">
          {data.length > 0 ? (
            <Line 
              ref={chartRef}
              data={chartData} 
              options={chartOptions} 
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Esperando datos...</p>
            </div>
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-card border-t border-primary p-3">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Puntos: {data.length}</span>
          <span>Actualización: 5s</span>
          <span className="text-green-400">● Activo</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Chart;