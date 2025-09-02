import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Download, Maximize2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

/**
 * Componente ImageViewer que muestra la imagen más reciente del Cansat
 * Incluye funcionalidades para descargar y ampliar la imagen
 */
const ImageViewer = ({ imageUrl }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  /**
   * Función para manejar la descarga de la imagen
   */
  const handleDownload = async () => {
    try {
      setIsLoading(true);
      
      // Simular descarga (en producción esto descargaría la imagen real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Descarga iniciada",
        description: "La imagen se está descargando...",
        duration: 3000,
      });
      
      // En un entorno real, aquí se implementaría la descarga real
      // const link = document.createElement('a');
      // link.href = imageUrl;
      // link.download = `cansat-image-${Date.now()}.jpg`;
      // link.click();
      
    } catch (error) {
      toast({
        title: "Error de descarga",
        description: "No se pudo descargar la imagen",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Función para ampliar la imagen (funcionalidad simulada)
   */
  const handleMaximize = () => {
    toast({
      title: "🚧 Esta función no está implementada aún",
      description: "¡Pero no te preocupes! ¡Puedes solicitarla en tu próximo prompt! 🚀",
      duration: 3000,
    });
  };

  /**
   * Función para refrescar la imagen
   */
  const handleRefresh = () => {
    setImageError(false);
    toast({
      title: "🚧 Esta función no está implementada aún",
      description: "¡Pero no te preocupes! ¡Puedes solicitarla en tu próximo prompt! 🚀",
      duration: 3000,
    });
  };

  /**
   * Manejar errores de carga de imagen
   */
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div 
      className="bg-black border-2 border-red-500 rounded-lg overflow-hidden space-glow"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Encabezado */}
      <div className="bg-black border-b border-red-500 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Camera className="text-red-500 mr-3" size={20} />
            <h3 className="text-lg font-bold text-white">Cámara del Cansat</h3>
          </div>
          
          {/* Controles de imagen */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="border-red-500 text-white hover:bg-red-500 hover:text-white"
            >
              <RefreshCw size={16} />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleMaximize}
              className="border-red-500 text-white hover:bg-red-500 hover:text-white"
            >
              <Maximize2 size={16} />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isLoading || imageError}
              className="border-red-500 text-white hover:bg-red-500 hover:text-white disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
            </Button>
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mt-1">
          Última captura: {new Date().toLocaleString()}
        </p>
      </div>

      {/* Contenedor de imagen */}
      <div className="relative h-80 bg-gray-900">
        {imageError ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <Camera className="text-gray-600 mb-4" size={48} />
            <p className="text-gray-400 mb-2">Error al cargar la imagen</p>
            <p className="text-gray-500 text-sm mb-4">
              No se pudo conectar con la cámara del Cansat
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="border-red-500 text-white hover:bg-red-500 hover:text-white"
            >
              <RefreshCw size={16} className="mr-2" />
              Reintentar
            </Button>
          </div>
        ) : (
          <>
            <img 
              className="w-full h-full object-cover"
              alt="Vista actual desde la cámara del Cansat mostrando el paisaje desde las alturas"
             src="https://images.unsplash.com/photo-1631544206215-eabb7ebbddb9" />
            
            {/* Overlay con información */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white font-mono text-sm">
                    Resolución: 1920x1080
                  </p>
                  <p className="text-gray-400 text-xs">
                    Formato: JPEG | Tamaño: 2.4 MB
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-green-400 text-sm font-bold">
                    ● TRANSMITIENDO
                  </p>
                  <p className="text-gray-400 text-xs">
                    Calidad: Alta
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Información adicional */}
      <div className="bg-black border-t border-red-500 p-3">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Modo: Automático</span>
          <span>Intervalo: 30s</span>
          <span>Almacenamiento: 85% libre</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageViewer;