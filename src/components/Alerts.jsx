import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';

/**
 * Componente para mostrar alertas críticas y de advertencia en la interfaz.
 */
const Alerts = ({ alerts, onClearAlert }) => {
  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 space-y-2">
      <AnimatePresence>
        {alerts.map(alert => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, transition: { duration: 0.3 } }}
            layout
            className={`flex items-center justify-between p-3 rounded-lg border-2 ${
              alert.type === 'critical'
                ? 'bg-red-900/50 border-red-500 text-white'
                : 'bg-yellow-900/50 border-yellow-500 text-white'
            }`}
          >
            <div className="flex items-center">
              {alert.type === 'critical' ? (
                <ShieldAlert className="h-5 w-5 mr-3 text-red-400 animate-pulse" />
              ) : (
                <AlertTriangle className="h-5 w-5 mr-3 text-yellow-400" />
              )}
              <span className="font-medium text-sm">{alert.message}</span>
            </div>
            <button
              onClick={() => onClearAlert(alert.id)}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Alerts;