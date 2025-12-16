import { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useParams, Link } from 'react-router-dom';
import { performCheckIn } from '../services/eventsService';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';

export function CheckInScanner() {
  const { eventId } = useParams();
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    participantName?: string;
  } | null>(null);
  
  // Ref to keep track if scanner is rendered to avoid double render in React Strict Mode
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // If we already have a result, don't restart scanner immediately or if already running
    if (scanResult || scannerRef.current) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      /* verbose= */ false
    );

    scannerRef.current = scanner;

    scanner.render(async (decodedText) => {
      // Pause authentication to prevent multiple reads
      scanner.clear();
      scannerRef.current = null; // Mark as cleared

      try {
        if (!eventId) throw new Error("Evento não identificado");
        
        await performCheckIn(eventId, decodedText);
        
        setScanResult({
          success: true,
          message: "ACESSO LIBERADO",
          // In a real app, API would return participant name
          participantName: `ID: ${decodedText.substring(0, 8)}...` 
        });
      } catch (error) {
        let errorMsg = "Erro ao processar check-in";
        if (axios.isAxiosError(error) && error.response) {
            // Adjust based on your API error response
            errorMsg = error.response.data.message || "Participante não encontrado ou já registrou entrada.";
        }
        
        setScanResult({
          success: false,
          message: errorMsg
        });
      }
    }, (errorMessage) => {
        // Parse errors are common when scanning frames without QR, ignore them
        console.log(errorMessage);
    });

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [eventId, scanResult]);

  const handleReset = () => {
    setScanResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col text-white">
      <header className="p-4 flex items-center justify-between bg-gray-800 shadow-md">
        <Link to="/events" className="text-gray-300 hover:text-white">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold">Scanner de Check-in</h1>
        <div className="w-6" /> {/* Spacer */}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 relative">
        {!scanResult && (
           <div className="w-full max-w-sm bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-700">
             <div id="reader" className="w-full" />
             <p className="text-center text-gray-400 p-4 text-sm">
               Aponte a câmera para o QR Code do ingresso
             </p>
           </div>
        )}

        {scanResult && (
          <div className={`w-full max-w-sm p-8 rounded-2xl shadow-2xl text-center transform transition-all ${
            scanResult.success ? 'bg-green-600' : 'bg-red-600'
          }`}>
            <div className="mb-4 flex justify-center">
              {scanResult.success ? (
                <CheckCircle size={64} className="text-white" />
              ) : (
                <XCircle size={64} className="text-white" />
              )}
            </div>
            
            <h2 className="text-3xl font-extrabold text-white mb-2">
              {scanResult.success ? "AUTORIZADO" : "RECUSADO"}
            </h2>
            
            <p className="text-white/90 text-lg font-medium mb-6">
              {scanResult.message}
            </p>

            {scanResult.participantName && (
              <div className="bg-white/20 rounded-lg p-3 mb-6">
                <p className="text-sm text-green-100 uppercase tracking-wide">Participante</p>
                <p className="text-xl font-bold text-white">{scanResult.participantName}</p>
              </div>
            )}

            <button
              onClick={handleReset}
              className="w-full bg-white text-gray-900 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              Escanear Próximo
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
