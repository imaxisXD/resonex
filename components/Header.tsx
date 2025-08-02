import { MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="relative z-10 bg-gray-100 px-8 py-3">
      <div className="flex items-center justify-end">
        <Button variant="outline" className="text-sm" size="sm">
          <MessageCircle className="h-4 w-4" />
          Report / Feedback
        </Button>
      </div>
    </header>
  );
}
