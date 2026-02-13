interface StatusIndicatorProps {
  status: "idle" | "recording" | "processing" | "playing";
}

const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  const labels: Record<string, string> = {
    idle: "Tap to speak",
    recording: "Listening...",
    processing: "Processing...",
    playing: "Speaking...",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
          status === "idle"
            ? "bg-muted-foreground"
            : status === "recording"
            ? "bg-primary animate-pulse"
            : status === "processing"
            ? "bg-accent animate-pulse"
            : "bg-accent"
        }`}
      />
      <span className="text-sm text-muted-foreground font-medium tracking-wide">
        {labels[status]}
      </span>
    </div>
  );
};

export default StatusIndicator;
