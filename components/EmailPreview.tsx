import LoadingSpinner from "./ui/LoadingSpinner";
import { EmailPreviewProps } from "./types/email-template";

export default function EmailPreview({
  html,
  templateName,
  className = "",
}: EmailPreviewProps) {
  if (!html) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <LoadingSpinner text="Loading preview..." />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded border bg-gray-50 ${className}`}>
      <iframe
        srcDoc={html}
        className="h-full w-full border-0"
        style={{ background: "white" }}
        title={`${templateName} email preview`}
      />
    </div>
  );
}
