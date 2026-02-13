import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

interface WaveVisualizerProps {
  isActive: boolean;
  audioBlob?: Blob | null;
  mediaStream?: MediaStream | null;
}

const WaveVisualizer = ({ isActive, audioBlob, mediaStream }: WaveVisualizerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // WaveSurfer for playback of recorded audio
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
    return () => ws.destroy();
  }, []);

  // Load recorded audio blob
  useEffect(() => {
    if (!wavesurferRef.current || !audioBlob) return;
    const url = URL.createObjectURL(audioBlob);
    wavesurferRef.current.load(url);
    return () => URL.revokeObjectURL(url);
  }, [audioBlob]);

  // Live mic visualization during recording
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mediaStream) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;
    const source = audioCtx.createMediaStreamSource(mediaStream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, width, height);

      const barWidth = 3;
      const gap = 2;
      const totalBarWidth = barWidth + gap;
      const barCount = Math.floor(width / totalBarWidth);
      const startIndex = Math.floor((bufferLength - barCount) / 2);

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.min(startIndex + i, bufferLength - 1);
        const value = dataArray[dataIndex < 0 ? 0 : dataIndex];
        const barHeight = Math.max(4, (value / 255) * height);
        const x = i * totalBarWidth;
        const y = (height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, "hsl(174, 60%, 45%)");
        gradient.addColorStop(1, "hsl(36, 95%, 55%)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      audioCtx.close();
    };
  }, [mediaStream]);

  const showLiveCanvas = !!mediaStream;
  const showWavesurfer = !mediaStream && audioBlob;
  const showPlaceholder = !mediaStream && !audioBlob;

  return (
    <div className="w-full max-w-md mx-auto px-4">
      {/* Live mic visualization */}
      <canvas
        ref={canvasRef}
        width={400}
        height={80}
        className={`w-full h-20 transition-opacity duration-300 ${showLiveCanvas ? "opacity-100" : "hidden"}`}
      />

      {/* Wavesurfer for recorded audio */}
      <div
        ref={containerRef}
        className={`transition-opacity duration-500 ${showWavesurfer ? "opacity-100" : "hidden"}`}
      />

      {/* Placeholder bars */}
      {showPlaceholder && (
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
