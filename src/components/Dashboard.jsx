import React from 'react';
import { motion } from 'framer-motion';
import Chart from '@/components/Chart';
import SensorSelector from '@/components/SensorSelector';
import BatteryIndicator from '@/components/BatteryIndicator';
import MissionControl from '@/components/MissionControl';
import { Satellite, Thermometer, Droplets, Sun, Wind, RotateCcw, Mountain, Gauge, Magnet, Cloud, Mic } from 'lucide-react';
import Rocket3DView from '@/components/Rocket3DView';
import DualMapView from '@/components/DualMapView';

/**
 * Componente Dashboard principal que organiza todos los elementos de la interfaz
 * Recibe los datos de telemetría y coordina la visualización de todos los componentes
 */
const Dashboard = ({ telemetryData, dataHistory, visibleSensors, onToggleSensor, trajectory }) => {
  // Configuración de animaciones para los componentes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const { roll, pitch, yaw } = telemetryData;

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Panel de información general */}
      <motion.div 
        className="bg-card border-2 border-primary rounded-lg p-6 space-glow"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Satellite className="text-primary mr-3" size={24} />
            <h2 className="text-xl font-bold text-card-foreground">Estado del Cansat</h2>
          </div>
          <BatteryIndicator level={telemetryData.battery_level} />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">Latitud</p>
            <p className="text-card-foreground font-mono text-lg">{telemetryData.latitude.toFixed(6)}°</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-sm">Longitud</p>
            <p className="text-card-foreground font-mono text-lg">{telemetryData.longitude.toFixed(6)}°</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-sm">Última Actualización</p>
            <p className="text-card-foreground font-mono text-sm">
              {new Date(telemetryData.timestamp).toLocaleTimeString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-sm">Estado</p>
            <p className="text-green-400 font-bold pulse-red">ACTIVO</p>
          </div>
        </div>
      </motion.div>

      {/* Selector de sensores */}
      <motion.div variants={itemVariants}>
        <SensorSelector 
          visibleSensors={visibleSensors}
          onToggleSensor={onToggleSensor}
          sensorStatus={telemetryData.sensor_status}
        />
      </motion.div>

      {/* Grid principal con mapas y visualización 3D */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <DualMapView 
            latitude={telemetryData.latitude}
            longitude={telemetryData.longitude}
            trajectory={trajectory}
          />
        </motion.div>
        <div className="flex flex-col gap-6">
          <motion.div variants={itemVariants}>
            <Rocket3DView roll={roll} pitch={pitch} yaw={yaw} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <MissionControl />
          </motion.div>
        </div>
      </div>

      {/* Grid de gráficos de sensores */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {visibleSensors.temperature && (
          <motion.div variants={itemVariants}>
            <Chart data={dataHistory.temperature} label="Temperatura (°C)" color="#ff0000" icon={<Thermometer size={20} />} currentValue={telemetryData.temperature} unit="°C" />
          </motion.div>
        )}
        {visibleSensors.humidity && (
          <motion.div variants={itemVariants}>
            <Chart data={dataHistory.humidity} label="Humedad (%)" color="#00ffff" icon={<Droplets size={20} />} currentValue={telemetryData.humidity} unit="%" />
          </motion.div>
        )}
        {visibleSensors.uv_index && (
          <motion.div variants={itemVariants}>
            <Chart data={dataHistory.uv_index} label="Índice UV" color="#ffff00" icon={<Sun size={20} />} currentValue={telemetryData.uv_index} unit="" />
          </motion.div>
        )}
        {visibleSensors.co2_level && (
          <motion.div variants={itemVariants}>
            <Chart data={dataHistory.co2_level} label="Nivel CO2 (ppm)" color="#00ff00" icon={<Wind size={20} />} currentValue={telemetryData.co2_level} unit="ppm" />
          </motion.div>
        )}
        {visibleSensors.altitude && (
          <motion.div variants={itemVariants}>
            <Chart data={dataHistory.altitude} label="Altitud (m)" color="#f97316" icon={<Mountain size={20} />} currentValue={telemetryData.altitude} unit="m" />
          </motion.div>
        )}
        {visibleSensors.contaminant && (
          <motion.div variants={itemVariants}>
            <Chart data={dataHistory.pm2_5_level} label="Contaminante PM2.5" color="#a855f7" icon={<Cloud size={20} />} currentValue={telemetryData.pm2_5_level} unit="µg/m³" />
          </motion.div>
        )}
        {visibleSensors.sound && (
          <motion.div variants={itemVariants}>
            <Chart data={dataHistory.sound_frequency} label="Frecuencia Sonido" color="#ec4899" icon={<Mic size={20} />} currentValue={telemetryData.sound_frequency} unit="Hz" />
          </motion.div>
        )}
        {visibleSensors.gyroscope && (
          <motion.div variants={itemVariants}>
            <Chart
              data={[...dataHistory.roll.map(item => ({ ...item, type: 'Roll' })), ...dataHistory.pitch.map(item => ({ ...item, type: 'Pitch' })), ...dataHistory.yaw.map(item => ({ ...item, type: 'Yaw' }))]}
              label="Giroscopio (°)" color={['#ff0000', '#00ff00', '#0000ff']} icon={<RotateCcw size={20} />}
              currentValue={`R:${telemetryData.roll.toFixed(1)}° P:${telemetryData.pitch.toFixed(1)}° Y:${telemetryData.yaw.toFixed(1)}°`} unit="°" isMultiLine={true}
            />
          </motion.div>
        )}
        {visibleSensors.accelerometer && (
          <motion.div variants={itemVariants}>
            <Chart
              data={[...dataHistory.acceleration_x.map(item => ({ ...item, type: 'X' })), ...dataHistory.acceleration_y.map(item => ({ ...item, type: 'Y' })), ...dataHistory.acceleration_z.map(item => ({ ...item, type: 'Z' }))]}
              label="Acelerómetro (m/s²)" color={['#ff0000', '#00ff00', '#0000ff']} icon={<Gauge size={20} />}
              currentValue={`X:${telemetryData.acceleration_x.toFixed(1)} Y:${telemetryData.acceleration_y.toFixed(1)} Z:${telemetryData.acceleration_z.toFixed(1)}`} unit="m/s²" isMultiLine={true}
            />
          </motion.div>
        )}
        {visibleSensors.magnetometer && (
          <motion.div variants={itemVariants}>
            <Chart
              data={[...dataHistory.magnetic_x.map(item => ({ ...item, type: 'X' })), ...dataHistory.magnetic_y.map(item => ({ ...item, type: 'Y' })), ...dataHistory.magnetic_z.map(item => ({ ...item, type: 'Z' }))]}
              label="Magnetómetro (µT)" color={['#ff0000', '#00ff00', '#0000ff']} icon={<Magnet size={20} />}
              currentValue={`X:${telemetryData.magnetic_x.toFixed(1)} Y:${telemetryData.magnetic_y.toFixed(1)} Z:${telemetryData.magnetic_z.toFixed(1)}`} unit="µT" isMultiLine={true}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;