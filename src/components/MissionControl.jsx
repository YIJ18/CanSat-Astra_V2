import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Send, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

/**
 * Componente para el control de la misión, como transmitir mensajes de emergencia.
 */
const MissionControl = () => {
  const [message, setMessage] = useState('MAYDAY, MAYDAY, CANSAT EN EMERGENCIA');
  const [altitude, setAltitude] = useState('500');

  const handleTransmit = () => {
    if (!message || !altitude) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, introduce un mensaje y una altitud.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Simulación de envío de comando al backend
    console.log(`Transmitiendo comando: Mensaje='${message}' a Altitud='${altitude}m'`);

    toast({
      title: "Comando Transmitido",
      description: `Mensaje de emergencia programado para ${altitude}m.`,
      duration: 4000,
    });
  };

  return (
    <motion.div
      className="bg-card border-2 border-primary rounded-lg p-4 space-glow h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-4">
        <Radio className="text-primary mr-3" size={20} />
        <h3 className="text-lg font-bold text-card-foreground">Control de Misión</h3>
      </div>

      <div className="space-y-4 flex-grow flex flex-col justify-between">
        <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center mb-2">
                <Send size={14} className="mr-2" /> Mensaje de Emergencia
            </label>
            <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mensaje de emergencia..."
                className="bg-secondary border-primary"
            />
        </div>
        
        <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center mb-2">
                <Target size={14} className="mr-2" /> Altitud de Transmisión (m)
            </label>
            <Input
                type="number"
                value={altitude}
                onChange={(e) => setAltitude(e.target.value)}
                placeholder="Ej: 500"
                className="bg-secondary border-primary"
            />
        </div>

        <Button
          onClick={handleTransmit}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Send className="mr-2" size={16} />
          Transmitir Comando
        </Button>
      </div>
    </motion.div>
  );
};

export default MissionControl;