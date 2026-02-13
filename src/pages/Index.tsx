import { useState, useCallback, useRef } from "react";
import aiCharacter from "@/assets/ai-character.png";
import MicButton from "@/components/MicButton";
import WaveVisualizer from "@/components/WaveVisualizer";
import StatusIndicator from "@/components/StatusIndicator";

type AppStatus = "idle" | "recording" | "processing" | "playing";

const Index = () => {
  const [status, setStatus] = useState<AppStatus>("idle");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setStatus("processing");
        stream.getTracks().forEach((t) => t.stop());

        // TODO: Send blob to your ASR API here
        // After getting response + TTS audio (PCM64), play it back
        setTimeout(() => setStatus("idle"), 2000); // placeholder
      };

      mediaRecorder.start();
      setStatus("recording");
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const handleMicClick = useCallback(() => {
    if (status === "recording") {
      stopRecording();
    } else if (status === "idle") {
      startRecording();
    }
  }, [status, startRecording, stopRecording]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      {/* Top section - Character */}
      <div className="flex-1 relative flex flex-col items-center justify-end overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary via-background to-background" />

        {/* Logo */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
          <h1 className="text-2xl font-bold tracking-tight">
            intell<span className="text-primary">a</span>
          </h1>
        </div>

        {/* Character image */}
        <div className="relative z-10 w-full max-w-sm">
          <img
            src={aiCharacter}
            alt="AI Assistant"
            className="w-full h-auto object-contain"
          />
          {/* Fade out bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>
      </div>

      {/* Bottom section - Controls */}
      <div className="flex flex-col items-center gap-6 pb-12 pt-4 relative z-10">
        <StatusIndicator status={status} />

        <WaveVisualizer
          isActive={status === "recording" || status === "playing"}
          audioBlob={audioBlob}
        />

        <MicButton
          isRecording={status === "recording"}
          isProcessing={status === "processing"}
          onClick={handleMicClick}
        />
      </div>
    </div>
  );
};

export default Index;
