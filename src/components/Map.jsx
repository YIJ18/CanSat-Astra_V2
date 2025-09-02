import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';

/**
 * Componente para actualizar la vista del mapa
 */
const MapUpdater = ({ center, zoom, trajectory }) => {
  const map = useMap();
  React.useEffect(() => {
    if (trajectory && trajectory.length > 1) {
      map.fitBounds(trajectory, { padding: [20, 20] });
    } else {
      map.setView(center, zoom);
    }
  }, [center, zoom, trajectory, map]);
  
  return null;
};

/**
 * Componente Map reutilizable que renderiza un mapa dinámico con Leaflet
 */
const Map = ({ latitude, longitude, trajectory, zoom, showTrajectoryLine }) => {
  // Crear icono personalizado para el marcador del Cansat
  const cansatIcon = new L.DivIcon({
    html: `
      <div style="
        background-color: var(--space-red);
        border: 2px solid #ffffff;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        box-shadow: 0 0 10px var(--space-red-glow);
        animation: pulse-red 2s infinite;
      "></div>
    `,
    className: 'cansat-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  const center = [latitude, longitude];

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="leaflet-container !border-0 !rounded-none"
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {showTrajectoryLine && trajectory.length > 1 && (
          <Polyline positions={trajectory} color="var(--space-red)" weight={3} opacity={0.7} />
        )}
        
        <Marker position={center} icon={cansatIcon}>
          <Popup>
            <div className="text-black">
              <strong>Cansat Activo</strong><br />
              Lat: {latitude.toFixed(6)}<br />
              Lng: {longitude.toFixed(6)}
            </div>
          </Popup>
        </Marker>
        
        <MapUpdater center={center} zoom={zoom} trajectory={showTrajectoryLine ? trajectory : null} />
      </MapContainer>
    </div>
  );
};

export default Map;