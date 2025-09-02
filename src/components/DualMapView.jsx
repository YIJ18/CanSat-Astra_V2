import React from 'react';
import { motion } from 'framer-motion';
import Map from '@/components/Map';
import { MapPin, Globe } from 'lucide-react';

const DualMapView = ({ latitude, longitude, trajectory }) => {
  return (
    <motion.div
      className="bg-card border-2 border-primary rounded-lg overflow-hidden space-glow"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 h-[450px]">
        {/* Mapa de Trayectoria */}
        <div className="relative border-r-2 border-primary">
          <div className="absolute top-0 left-0 w-full bg-card/80 backdrop-blur-sm p-2 z-10 border-b border-primary">
            <div className="flex items-center text-sm">
              <Globe className="text-primary mr-2" size={16} />
              <h4 className="font-bold text-card-foreground">Vista de Misión</h4>
            </div>
          </div>
          <Map
            latitude={latitude}
            longitude={longitude}
            trajectory={trajectory}
            zoom={5}
            showTrajectoryLine={true}
          />
        </div>
        
        {/* Mapa de Ubicación Exacta */}
        <div className="relative">
          <div className="absolute top-0 left-0 w-full bg-card/80 backdrop-blur-sm p-2 z-10 border-b border-primary">
            <div className="flex items-center text-sm">
              <MapPin className="text-primary mr-2" size={16} />
              <h4 className="font-bold text-card-foreground">Ubicación Actual</h4>
            </div>
          </div>
          <Map
            latitude={latitude}
            longitude={longitude}
            trajectory={null}
            zoom={15}
            showTrajectoryLine={false}
          />
        </div>
      </div>
      <div className="bg-card border-t border-primary p-3">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Puntos de ruta: {trajectory.length}</span>
          <span>Lat: {latitude.toFixed(4)}, Lng: {longitude.toFixed(4)}</span>
          <span className="text-green-400">● GPS Activo</span>
        </div>
      </div>
    </motion.div>
  );
};

export default DualMapView;