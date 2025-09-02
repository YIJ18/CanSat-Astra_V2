import React from 'react';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Thermometer, Droplets, Sun, Wind, RotateCcw, Settings, Mountain, Gauge, Magnet, Cloud, Mic } from 'lucide-react';

/**
 * Componente SensorSelector que gestiona qué gráficos de sensores se muestran
 * Utiliza casillas de verificación y muestra el estado de conexión de cada sensor
 */
const SensorSelector = ({ visibleSensors, onToggleSensor, sensorStatus }) => {
  // Configuración de sensores con sus iconos y etiquetas
  const sensors = [
    { key: 'temperature', label: 'Temperatura', icon: <Thermometer size={16} />, description: 'Temp. ambiente' },
    { key: 'humidity', label: 'Humedad', icon: <Droplets size={16} />, description: 'Humedad relativa' },
    { key: 'uv_index', label: 'Índice UV', icon: <Sun size={16} />, description: 'Radiación UV' },
    { key: 'co2_level', label: 'Nivel CO2', icon: <Wind size={16} />, description: 'Dióxido de carbono' },
    { key: 'altitude', label: 'Altitud', icon: <Mountain size={16} />, description: 'Altitud (metros)' },
    { key: 'contaminant', label: 'PM2.5', icon: <Cloud size={16} />, description: 'Partículas PM2.5' },
    { key: 'sound', label: 'Sonido', icon: <Mic size={16} />, description: 'Frecuencia de sonido' },
    { key: 'gyroscope', label: 'Giroscopio', icon: <RotateCcw size={16} />, description: 'Orientación' },
    { key: 'accelerometer', label: 'Acelerómetro', icon: <Gauge size={16} />, description: 'Aceleración (X,Y,Z)' },
    { key: 'magnetometer', label: 'Magnetómetro', icon: <Magnet size={16} />, description: 'Campo magnético' },
  ];

  const getStatusColor = (status) => {
    if (status === 'ok') return 'text-green-500';
    return 'text-red-500 animate-pulse';
  };

  return (
    <motion.div 
      className="bg-card border-2 border-primary rounded-lg p-6 space-glow"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-6">
        <Settings className="text-primary mr-3" size={24} />
        <h2 className="text-xl font-bold text-card-foreground">Control de Sensores</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
        {sensors.map((sensor, index) => {
          const status = sensorStatus[sensor.key] || 'ok';
          return (
            <motion.div
              key={sensor.key}
              className="bg-secondary border border-primary rounded-lg p-3 hover:bg-accent transition-colors cursor-pointer flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => onToggleSensor(sensor.key)}
            >
              <div className="flex items-start space-x-2">
                <Checkbox
                  id={sensor.key}
                  checked={visibleSensors[sensor.key]}
                  onCheckedChange={() => onToggleSensor(sensor.key)}
                  className="mt-1 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <div className="flex-1 min-w-0">
                  <Label htmlFor={sensor.key} className="flex items-center text-secondary-foreground font-medium cursor-pointer">
                    <span className={getStatusColor(status)}>{sensor.icon}</span>
                    <span className="ml-2 text-xs">{sensor.label}</span>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1 leading-tight">{sensor.description}</p>
                </div>
              </div>
              <div className="flex items-center mt-2">
                <div className={`w-2 h-2 rounded-full mr-1.5 ${visibleSensors[sensor.key] ? 'bg-green-400' : 'bg-gray-600'}`} />
                <span className="text-xs text-muted-foreground">{visibleSensors[sensor.key] ? 'Visible' : 'Oculto'}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SensorSelector;