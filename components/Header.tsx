"use client";
import { MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Textarea } from "./ui/textarea";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  const sendFeedback = useMutation(api.feedback.sendFeedback);

  const handleSubmit = async () => {
    if (!feedback) {
      toast.error("Please enter your feedback");
      return;
    }
    await sendFeedback({ feedback });
    setFeedback("");
    setOpen(false);
  };

  const handleFeedback = useCallback(() => {
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [open]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "F" || e.key === "f") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleFeedback();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [handleFeedback]);

  return (
    <header className="relative z-10 bg-gray-100 px-8 py-3">
      <div className="flex items-center justify-end">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-9 text-sm"
              size="sm"
              onClick={handleFeedback}
            >
              <MessageCircle className="h-4 w-4" />
              Report / Feedback
              <kbd className="pointer-events-none ml-2 inline-flex h-6 items-center justify-center rounded border border-gray-400 bg-gray-50 p-1.5 px-2 font-mono text-sm font-medium text-gray-600 shadow-sm select-none">
                ⌘ F
              </kbd>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            sideOffset={8}
            align="end"
            className="border border-gray-400"
          >
            <form action={handleSubmit}>
              <Textarea
                placeholder="Enter your feedback here or report the bug."
                className="mb-2"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  type="submit"
                  disabled={!feedback}
                >
                  Submit
                </Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
