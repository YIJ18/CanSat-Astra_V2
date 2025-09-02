import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/components/Dashboard';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import Alerts from '@/components/Alerts';

/**
 * Componente principal de la aplicación de telemetría Cansat
 * Maneja el estado global de la aplicación y las actualizaciones de datos en tiempo real
 */
function App() {
  // Estado para el tema (dark/light)
  const [theme, setTheme] = useState('dark');
  // Estado para almacenar los datos de telemetría más recientes
  const [telemetryData, setTelemetryData] = useState(null);
  // Estado para el historial de trayectoria
  const [trajectory, setTrajectory] = useState([]);
  // Estado para las alertas activas
  const [alerts, setAlerts] = useState([]);
  // Referencia para el temporizador de pérdida de señal
  const loraTimeoutRef = useRef(null);
  
  // Estado para controlar qué sensores están visibles en el dashboard
  const [visibleSensors, setVisibleSensors] = useState({
    temperature: true,
    humidity: true,
    uv_index: true,
    co2_level: true,
    gyroscope: true,
    altitude: true,
    accelerometer: true,
    contaminant: true,
    magnetometer: true,
    sound: true,
  });

  // Estado para el historial de datos (para gráficos)
  const [dataHistory, setDataHistory] = useState({
    temperature: [],
    humidity: [],
    uv_index: [],
    co2_level: [],
    roll: [],
    pitch: [],
    yaw: [],
    altitude: [],
    acceleration_x: [],
    acceleration_y: [],
    acceleration_z: [],
    pm2_5_level: [],
    magnetic_x: [],
    magnetic_y: [],
    magnetic_z: [],
    sound_frequency: [],
  });

  // Efecto para manejar el cambio de tema
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  /**
   * Función para alternar el tema
   */
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  /**
   * Lógica para verificar y activar alertas
   */
  const checkAlerts = (data) => {
    const newAlerts = [];

    // Alerta de temperatura alta
    if (data.temperature > 50) {
      newAlerts.push({ id: 'temp_high', type: 'critical', message: `Temperatura crítica: ${data.temperature.toFixed(1)}°C` });
    }

    // Alerta de batería baja
    if (data.battery_level < 20) {
      newAlerts.push({ id: 'battery_low', type: 'warning', message: `Batería baja: ${Math.round(data.battery_level)}%` });
    }

    // Alertas de estado de sensores
    Object.entries(data.sensor_status).forEach(([sensor, status]) => {
      if (status !== 'ok') {
        newAlerts.push({ id: `sensor_${sensor}`, type: 'warning', message: `Fallo en sensor ${sensor}: ${status}` });
      }
    });

    setAlerts(newAlerts);
  };

  /**
   * Función para obtener datos de telemetría desde la API de Django
   */
  const fetchTelemetryData = async () => {
    try {
      // Simulación de datos de telemetría con todos los campos nuevos
      const mockData = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        latitude: trajectory.length > 0 ? trajectory[trajectory.length - 1][0] + (Math.random() - 0.5) * 0.001 : 40.7128,
        longitude: trajectory.length > 0 ? trajectory[trajectory.length - 1][1] + (Math.random() - 0.5) * 0.001 : -74.0060,
        temperature: 48 + Math.random() * 5, // A veces supera 50
        humidity: 40 + Math.random() * 30,
        uv_index: Math.random() * 11,
        co2_level: 400 + Math.random() * 200,
        roll: (Math.random() - 0.5) * 180,
        pitch: (Math.random() - 0.5) * 180,
        yaw: (Math.random() - 0.5) * 180,
        image_url: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`,
        battery_level: 18 + Math.random() * 20, // A veces baja de 20
        altitude: 100 + Math.random() * 1000,
        acceleration_x: (Math.random() - 0.5) * 2,
        acceleration_y: (Math.random() - 0.5) * 2,
        acceleration_z: 9.8 + (Math.random() - 0.5) * 1,
        pm2_5_level: Math.random() * 50,
        magnetic_x: (Math.random() - 0.5) * 100,
        magnetic_y: (Math.random() - 0.5) * 100,
        magnetic_z: (Math.random() - 0.5) * 100,
        sound_frequency: 200 + Math.random() * 800,
        sensor_status: {
          temperature: 'ok',
          humidity: Math.random() > 0.9 ? 'disconnected' : 'ok',
          gps: 'ok',
          gyroscope: 'ok',
          accelerometer: 'ok',
          magnetometer: Math.random() > 0.95 ? 'error' : 'ok',
        },
      };

      setTelemetryData(mockData);
      setTrajectory(prev => [...prev, [mockData.latitude, mockData.longitude]]);
      checkAlerts(mockData);

      // Reiniciar temporizador de LoRa
      clearTimeout(loraTimeoutRef.current);
      loraTimeoutRef.current = setTimeout(() => {
        setAlerts(prev => [...prev.filter(a => a.id !== 'lora_timeout'), { id: 'lora_timeout', type: 'critical', message: 'Pérdida de señal LoRa (30s)' }]);
      }, 30000);

      // Actualizar historial de datos para gráficos
      setDataHistory(prev => {
        const newHistory = { ...prev };
        const maxPoints = 30; // Mantener solo los últimos 30 puntos

        Object.keys(newHistory).forEach(key => {
          if (mockData[key] !== undefined) {
            newHistory[key] = [...(prev[key] || []), {
              timestamp: mockData.timestamp,
              value: mockData[key]
            }].slice(-maxPoints);
          }
        });
        return newHistory;
      });

      toast({
        title: "Datos actualizados",
        description: "Telemetría recibida correctamente",
        duration: 2000,
      });

    } catch (error) {
      console.error('Error fetching telemetry data:', error);
      toast({
        title: "Error de conexión",
        description: "No se pudieron obtener los datos de telemetría",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  /**
   * Efecto para obtener datos de telemetría cada 5 segundos
   */
  useEffect(() => {
    fetchTelemetryData();
    const interval = setInterval(fetchTelemetryData, 5000);
    return () => {
      clearInterval(interval);
      clearTimeout(loraTimeoutRef.current);
    };
  }, []);

  /**
   * Función para alternar la visibilidad de un sensor específico
   */
  const toggleSensorVisibility = (sensorName) => {
    setVisibleSensors(prev => ({
      ...prev,
      [sensorName]: !prev[sensorName]
    }));
  };

  return (
    <>
      <Helmet>
        <title>Sistema de Telemetría Cansat</title>
        <meta name="description" content="Sistema avanzado de monitoreo en tiempo real para telemetría de Cansat con visualización de datos espaciales" />
        <meta property="og:title" content="Sistema de Telemetría Cansat" />
        <meta property="og:description" content="Sistema avanzado de monitoreo en tiempo real para telemetría de Cansat con visualización de datos espaciales" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <motion.header 
          className="bg-background border-b-2 border-primary p-4 sticky top-0 z-50 backdrop-blur-sm bg-opacity-80"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-center flex-grow">
              <h1 className="text-3xl font-bold text-foreground">
                <span className="text-primary">CANSAT</span> TELEMETRÍA
              </h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Sistema de Monitoreo Espacial en Tiempo Real
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </motion.header>

        <main className="container mx-auto p-4">
          <Alerts alerts={alerts} onClearAlert={id => setAlerts(prev => prev.filter(a => a.id !== id))} />
          {telemetryData ? (
            <Dashboard 
              telemetryData={telemetryData}
              dataHistory={dataHistory}
              visibleSensors={visibleSensors}
              onToggleSensor={toggleSensorVisibility}
              trajectory={trajectory}
            />
          ) : (
            <motion.div 
              className="flex items-center justify-center h-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-xl text-muted-foreground">Conectando con Cansat...</p>
              </div>
            </motion.div>
          )}
        </main>

        <footer className="bg-background border-t-2 border-primary p-4 mt-8">
          <div className="container mx-auto text-center">
            <p className="text-muted-foreground">
              Sistema de Telemetría Cansat - Monitoreo Espacial Avanzado
            </p>
          </div>
        </footer>

        <Toaster />
      </div>
    </>
  );
}

export default App;