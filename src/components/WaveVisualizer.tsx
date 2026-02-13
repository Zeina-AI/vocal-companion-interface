import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

interface WaveVisualizerProps {
  isActive: boolean;
  audioBlob?: Blob | null;
}

const WaveVisualizer = ({ isActive, audioBlob }: WaveVisualizerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "hsl(174, 60%, 45%)",
      progressColor: "hsl(36, 95%, 55%)",
      cursorWidth: 0,
      barWidth: 3,
      barGap: 2,
      barRadius: 3,
      height: 80,
      normalize: true,
      interact: false,
      fillParent: true,
    });

    wavesurferRef.current = ws;

    return () => {
      ws.destroy();
    };
  }, []);

  useEffect(() => {
    if (!wavesurferRef.current || !audioBlob) return;

    const url = URL.createObjectURL(audioBlob);
    wavesurferRef.current.load(url);

    return () => URL.revokeObjectURL(url);
  }, [audioBlob]);

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div
        ref={containerRef}
        className={`transition-opacity duration-500 ${
          isActive || audioBlob ? "opacity-100" : "opacity-30"
        }`}
      />
      {!audioBlob && !isActive && (
        <div className="flex items-center justify-center gap-1 h-20">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="w-[3px] rounded-full bg-accent/30"
              style={{
                height: `${15 + Math.sin(i * 0.5) * 25 + Math.random() * 10}px`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WaveVisualizer;
