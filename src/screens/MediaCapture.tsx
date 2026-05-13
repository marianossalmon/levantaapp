import { Camera, Video, Mic, X, Square, Play, Check } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useRef, useEffect } from 'react';

// Declare SpeechRecognition interfaces for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function MediaCapture() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<null | 'audio'>('audio'); 
  // Let's set it to null initially, but for now we only implement 'audio' detailed logic
  
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize SpeechRecognition if available
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'es-ES'; // assuming Spanish based on prompt

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
      };

      mediaRecorder.start();
      if (recognitionRef.current) {
        setTranscript('');
        recognitionRef.current.start();
      }
      setIsRecording(true);
      setRecordedAudioUrl(null);
    } catch (err) {
      console.error("Error accessing microphone", err);
      alert("No se pudo acceder al micrófono.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const saveAudioNote = () => {
    // Here we would normally save to our local DB/state
    console.log("Saving note with transcript:", transcript);
    console.log("Audio URL:", recordedAudioUrl);
    alert("Nota de voz y transcripción guardadas correctamente.");
    setActiveMode(null);
    setTranscript('');
    setRecordedAudioUrl(null);
  };

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] z-50 flex flex-col text-white font-sans">
      <div className="h-16 flex items-center justify-between px-6 border-b border-[#333] bg-[#151619]">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#00FF00]">
          {activeMode === 'audio' ? 'Nota de Voz' : 'Adjuntar Multimedia'}
        </h2>
        <button onClick={() => activeMode ? setActiveMode(null) : navigate(-1)} className="p-2 border border-gray-600 rounded text-white hover:bg-gray-800 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8 overflow-y-auto">
        {!activeMode ? (
          <>
            <div className="text-center space-y-2 max-w-sm">
              <p className="text-gray-400 text-xs font-mono uppercase tracking-wider">Captura evidencia del levantamiento. Los archivos se vincularán al plano actual.</p>
            </div>

            <div className="w-full max-w-sm space-y-4">
              <button className="w-full bg-[#151619] border border-[#333] hover:border-[#00FF00] p-6 rounded flex flex-col items-center gap-3 transition-colors group">
                <div className="text-[#8E9299] group-hover:text-[#00FF00] transition-colors">
                  <Camera size={32} />
                </div>
                <span className="font-bold text-sm uppercase tracking-widest">Tomar Foto</span>
              </button>
              
              <button className="w-full bg-[#151619] border border-[#333] hover:border-[#00FF00] p-6 rounded flex flex-col items-center gap-3 transition-colors group">
                <div className="text-[#8E9299] group-hover:text-[#00FF00] transition-colors">
                  <Video size={32} />
                </div>
                <span className="font-bold text-sm uppercase tracking-widest">Grabar Video Corto</span>
              </button>

              <button 
                onClick={() => setActiveMode('audio')}
                className="w-full bg-[#151619] border border-[#333] hover:border-[#00FF00] p-6 rounded flex flex-col items-center gap-3 transition-colors group"
              >
                <div className="text-[#8E9299] group-hover:text-[#00FF00] transition-colors">
                  <Mic size={32} />
                </div>
                <span className="font-bold text-sm uppercase tracking-widest">Nota de Voz</span>
              </button>
            </div>
          </>
        ) : activeMode === 'audio' ? (
          <div className="w-full max-w-md flex flex-col items-center gap-8">
            <div className="w-full bg-[#151619] border border-[#333] rounded-lg p-6 min-h-[200px] flex flex-col">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Transcripción en vivo</h3>
              <div className="flex-1 text-sm font-mono text-gray-300 whitespace-pre-wrap">
                {transcript || (isRecording ? "Escuchando..." : "Presiona grabar para comenzar a hablar. Tu voz será convertida a texto automáticamente.")}
              </div>
            </div>

            {recordedAudioUrl && !isRecording && (
              <div className="w-full bg-[#151619] border border-[#333] rounded-lg p-4 flex items-center justify-between">
                <audio src={recordedAudioUrl} controls className="w-full h-10" />
              </div>
            )}

            <div className="flex gap-4">
              {!isRecording ? (
                <button 
                  onClick={startRecording}
                  className="w-16 h-16 bg-[#222] border border-[#00FF00] rounded-full flex items-center justify-center text-[#00FF00] hover:bg-[#333] transition-colors shadow-[0_0_15px_rgba(0,255,0,0.2)]"
                >
                  <Mic size={28} />
                </button>
              ) : (
                <button 
                  onClick={stopRecording}
                  className="w-16 h-16 bg-[#222] border border-red-500 rounded-full flex items-center justify-center text-red-500 hover:bg-[#333] transition-colors shadow-[0_0_15px_rgba(255,0,0,0.2)]"
                >
                  <Square size={24} fill="currentColor" />
                </button>
              )}

              {recordedAudioUrl && !isRecording && (
                <button 
                  onClick={saveAudioNote}
                  className="flex items-center gap-2 px-6 py-0 bg-[#00FF00] text-black font-bold text-sm uppercase tracking-widest rounded transition-colors hover:bg-green-400"
                >
                  <Check size={20} /> Guardar
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
