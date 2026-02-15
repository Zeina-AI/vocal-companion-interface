import { useState } from "react";
import { MessageSquareText } from "lucide-react";

interface TranscriptButtonProps {
  asrText: string;
  replyText: string;
}

const TranscriptButton = ({ asrText, replyText }: TranscriptButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Popup */}
      {isOpen && (
        <div className="w-72 rounded-lg border border-border bg-card p-3 shadow-lg space-y-2 animate-in fade-in-0 zoom-in-95 duration-200">
          <div>
            <span className="text-xs font-semibold text-muted-foreground tracking-wide">ASR</span>
            <p className="text-sm text-foreground mt-0.5" dir="auto">{asrText || "—"}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground tracking-wide">REPLY</span>
            <p className="text-sm text-foreground mt-0.5" dir="auto">{replyText || "—"}</p>
          </div>
        </div>
      )}

      {/* Button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Show transcript"
      >
        <MessageSquareText className="w-5 h-5" />
      </button>
    </div>
  );
};

export default TranscriptButton;
