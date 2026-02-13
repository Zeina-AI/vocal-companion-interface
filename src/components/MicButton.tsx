import { Mic, MicOff } from "lucide-react";

interface MicButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  onClick: () => void;
}

const MicButton = ({ isRecording, isProcessing, onClick }: MicButtonProps) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow ring */}
      <div
        className={`absolute w-28 h-28 rounded-full transition-all duration-500 ${
          isRecording
            ? "gradient-radial-mic scale-110 animate-pulse"
            : "gradient-radial-mic scale-100 opacity-60"
        }`}
      />

      {/* Button */}
      <button
        onClick={onClick}
        disabled={isProcessing}
        className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
          isRecording
            ? "bg-primary glow-mic-active scale-105"
            : "bg-secondary hover:bg-muted glow-mic"
        } ${isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {isRecording ? (
          <MicOff className="w-8 h-8 text-primary-foreground" />
        ) : (
          <Mic className="w-8 h-8 text-foreground" />
        )}
      </button>
    </div>
  );
};

export default MicButton;
