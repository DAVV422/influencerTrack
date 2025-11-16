"use client";

import { useParams } from "next/navigation";

// Define los colores de la paleta para facilitar el uso en el código
const COLOR_PRIMARY = "#6D37D4";
const COLOR_HOVER = "#8457DB";
const COLOR_WHITE = "#FFFFFF";

export default function FollowerDownloadPage() {
  const { influencer, network } = useParams();

  const handleClick = async () => {
    try {
      await fetch(`/api/metrics/click/${influencer}/${network}`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Error registrando clic:", err);
    }
  };

  return (
    // Aplica un fondo muy suave o blanco si prefieres
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: '#f9f9f9' }}>
      
      {/* Contenedor principal con fondo blanco y sombra destacada */}
      <div className="p-10 rounded-2xl shadow-2xl max-w-md w-full text-center" style={{ backgroundColor: COLOR_WHITE }}>
        
        {/* Encabezado */}
        <h1 className="text-3xl font-extrabold mb-4" style={{ color: COLOR_PRIMARY }}>
          🚀 ¡Descarga la app recomendada por {influencer}!
        </h1>

        {/* Descripción */}
        <p className="text-gray-700 mb-8 text-lg">
          Da clic en el botón de abajo para iniciar la <strong>descarga de Takenos.</strong>
        </p>
        
        {/* Enlace y Botón */}
        <a
          href="https://takenos.go.link/f4VPN"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          // El 'a' envuelve al botón, asegurando que el clic siempre se registre
        >
          <button
            className="w-full py-4 text-xl rounded-xl font-bold transition duration-300 ease-in-out transform hover:scale-[1.02]"
            style={{
              backgroundColor: COLOR_PRIMARY,
              color: COLOR_WHITE,
              boxShadow: `0 4px 15px 0 ${COLOR_PRIMARY}66`, // Sombra suave del color primario
            }}
            // Clase de hover personalizada para Tailwind con el color de la paleta
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLOR_HOVER}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLOR_PRIMARY}
          >
            Descargar Takenos ahora
          </button>
        </a>
        
        {/* Pequeño texto adicional para el contexto de la marca */}
        <p className="text-xs text-gray-400 mt-4">
            ¡Comienza a simplificar tu vida financiera!
        </p>

      </div>
    </div>
  );
}