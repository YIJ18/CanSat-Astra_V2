import React from 'react';
import { BatteryFull, BatteryMedium, BatteryLow, BatteryWarning } from 'lucide-react';

/**
 * Componente para mostrar el nivel de batería con un ícono y porcentaje.
 * El ícono y el color cambian según el nivel de la batería.
 */
const BatteryIndicator = ({ level }) => {
  const roundedLevel = Math.round(level);

  // Determinar el ícono y el color según el nivel de la batería
  let batteryIcon;
  let colorClass;

  if (roundedLevel > 75) {
    batteryIcon = <BatteryFull size={24} />;
    colorClass = 'text-green-500';
  } else if (roundedLevel > 40) {
    batteryIcon = <BatteryMedium size={24} />;
    colorClass = 'text-yellow-500';
  } else if (roundedLevel > 15) {
    batteryIcon = <BatteryLow size={24} />;
    colorClass = 'text-orange-500';
  } else {
    batteryIcon = <BatteryWarning size={24} className="animate-pulse" />;
    colorClass = 'text-red-500';
  }

  return (
    <div className="flex items-center space-x-2">
      <div className={colorClass}>
        {batteryIcon}
      </div>
      <span className={`font-mono text-lg font-bold ${colorClass}`}>
        {roundedLevel}%
      </span>
    </div>
  );
};

export default BatteryIndicator;