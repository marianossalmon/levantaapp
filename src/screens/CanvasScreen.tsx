import { useEffect, useRef, useState, useMemo } from 'react';
import { Stage, Layer, Circle, Line } from 'react-konva';
import { useSurveyCanvas } from '../hooks/useSurveyCanvas';
import { distance, midPoint } from '../lib/utils';
import { Pause, Play, Download, Save, LocateFixed, Camera as CameraIcon } from 'lucide-react';
import MeasurementInput from '../components/MeasurementInput';
import Toolbar from '../components/Toolbar';
import { Node, Segment } from '../types/survey';
import { useNavigate } from 'react-router';

export default function CanvasScreen() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const navigate = useNavigate();

  const {
    nodes,
    segments,
    selectedNodeId,
    scalePixelRatio,
    setScalePixelRatio,
    addNode,
    updateSegmentLength,
    selectNode,
    clearSelection,
  } = useSurveyCanvas();

  useEffect(() => {
    const initCamera = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("La API de cámara no es soportada en este navegador o entorno.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: { ideal: 'environment' } } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn("Camera with facingMode 'environment' failed, trying default...", err);
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
          }
        } catch (fallbackErr) {
          console.warn("No camera available or permissions denied.");
          setCameraError("No se encontró una cámara o permisos denegados.");
        }
      }
    };
    initCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleCamera = () => {
    if (videoRef.current) {
      if (cameraActive) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setCameraActive(!cameraActive);
    }
  };

  const handleStageClick = (e: any) => {
    // If clicking on an existing shape, do nothing here (handled by shape onClick)
    if (e.target !== e.target.getStage()) {
      return;
    }
    
    // Haptic feedback if supported
    if (navigator.vibrate) navigator.vibrate(50);
    
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    if (pointerPosition) {
      addNode(pointerPosition);
    }
  };

  const nodeMap = useMemo(() => {
    return nodes.reduce((acc, n) => {
      acc[n.id] = n;
      return acc;
    }, {} as Record<string, Node>);
  }, [nodes]);

  const handleSegmentLengthChange = (segmentId: string, val: number) => {
    const segment = segments.find(s => s.id === segmentId);
    if (!segment) return;
    
    updateSegmentLength(segmentId, val);

    // If this is the first measured segment, define the scale!
    if (!scalePixelRatio && val > 0) {
      const p1 = nodeMap[segment.startNodeId];
      const p2 = nodeMap[segment.endNodeId];
      if (p1 && p2) {
        const distPx = distance(p1, p2);
        setScalePixelRatio(distPx / val);
      }
    }
  };

  return (
    <div className="relative w-full h-[100dvh] bg-[#0A0A0A] overflow-hidden flex flex-col font-sans">
      {/* Top Bar */}
      <div className="absolute top-0 inset-x-0 h-16 bg-[#151619] border-b border-[#333] z-50 flex items-center justify-between px-6">
        <button onClick={() => navigate('/')} className="px-4 py-2 border border-gray-600 rounded-lg text-xs font-bold uppercase text-white hover:bg-gray-800 transition-colors">
          Cerrar
        </button>
        <span className="text-white font-bold text-sm uppercase tracking-widest text-[#00FF00]">Levantamiento #001</span>
        <button className="px-4 py-2 bg-white text-black rounded-lg text-xs font-bold uppercase hover:bg-gray-200 transition-colors">
          Guardar
        </button>
      </div>

      {/* Camera Background */}
      {cameraError ? (
        <div className="absolute inset-0 w-full h-full bg-[#111] flex items-center justify-center p-8 opacity-60">
          <p className="text-[#8E9299] text-sm text-center font-mono uppercase tracking-widest">{cameraError}</p>
        </div>
      ) : (
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"
        />
      )}

      {/* Camera Indicator */}
      <div className="absolute top-20 left-4 z-20 flex items-center gap-2">
        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
        <span className="text-xs font-bold text-white uppercase tracking-widest drop-shadow-md">Cam en Vivo</span>
      </div>

      {/* Konva Stage */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 z-10"
        onContextMenu={(e) => e.preventDefault()}
      >
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          onClick={handleStageClick}
          onTap={handleStageClick}
        >
          <Layer>
            {segments.map(seg => {
              const p1 = nodeMap[seg.startNodeId];
              const p2 = nodeMap[seg.endNodeId];
              if (!p1 || !p2) return null;
              return (
                <Line
                  key={seg.id}
                  points={[p1.x, p1.y, p2.x, p2.y]}
                  stroke="#00FF00"
                  strokeWidth={2}
                  lineCap="round"
                  lineJoin="round"
                />
              );
            })}

            {nodes.map(node => (
              <Circle
                key={node.id}
                x={node.x}
                y={node.y}
                radius={node.id === selectedNodeId ? 8 : 6}
                fill={node.id === selectedNodeId ? "#ffffff" : "#00FF00"}
                stroke="#00FF00"
                strokeWidth={node.id === selectedNodeId ? 2 : 0}
                shadowColor="#00FF00"
                shadowBlur={10}
                shadowOpacity={1}
                onClick={(e) => {
                  e.cancelBubble = true;
                  selectNode(node.id);
                  if (navigator.vibrate) navigator.vibrate(20);
                }}
                onTap={(e) => {
                  e.cancelBubble = true;
                  selectNode(node.id);
                  if (navigator.vibrate) navigator.vibrate(20);
                }}
              />
            ))}
          </Layer>
        </Stage>

        {/* DOM Overlays for Inputs */}
        {segments.map(seg => {
          const p1 = nodeMap[seg.startNodeId];
          const p2 = nodeMap[seg.endNodeId];
          if (!p1 || !p2) return null;
          
          const mid = midPoint(p1, p2);
          const pxDist = distance(p1, p2);
          
          let autoScaled = null;
          if (seg.lengthCm === null && scalePixelRatio !== null && scalePixelRatio > 0) {
            autoScaled = pxDist / scalePixelRatio;
          }

          return (
            <MeasurementInput
              key={seg.id}
              x={mid.x}
              y={mid.y}
              value={seg.lengthCm}
              autoScaledValue={autoScaled}
              onChange={(val) => handleSegmentLengthChange(seg.id, val)}
              scaleReady={scalePixelRatio !== null}
            />
          );
        })}
      </div>

      <Toolbar onSelectElement={(type) => console.log('Selected element: ', type)} />

      {/* Floating Action Buttons */}
      <div className="absolute right-6 bottom-8 z-20 flex flex-col gap-4">
        <button 
          onClick={() => navigate('/media')}
          className="w-14 h-14 bg-[#222] border border-[#444] rounded-lg flex items-center justify-center text-[#00FF00] hover:bg-[#333] transition-colors"
        >
          <CameraIcon size={24} />
        </button>
        <button 
          onClick={clearSelection}
          className="w-14 h-14 bg-[#222] border border-[#444] rounded-lg flex items-center justify-center text-[#00FF00] hover:bg-[#333] transition-colors"
        >
          <LocateFixed size={24} />
        </button>
        <button 
          onClick={toggleCamera}
          className="w-14 h-14 bg-[#222] border border-[#444] rounded-lg flex items-center justify-center text-[#00FF00] hover:bg-[#333] transition-colors"
        >
          {cameraActive ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
        </button>
      </div>
    </div>
  );
}
