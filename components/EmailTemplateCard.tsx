import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "./ui/button";
import { EmailTemplateCardProps } from "./types/email-template";

export default function EmailTemplateCard({
  template,
  index,
  isSelected,
  emailHTML,
  onSelect,
  onPreview,
}: EmailTemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(index);
    }
  };

  const handlePreviewClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onPreview(index, event);
  };

  return (
    <div
      className={`relative h-full cursor-pointer space-y-3 rounded-lg border p-4 transition-all duration-150 ease-in-out outline-none ${
        isSelected
          ? "bg-highlight ring-highlight-txt ring-2"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
      }`}
      onClick={() => onSelect(index)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`Select ${template.name} template`}
    >
      <div className="text-center">
        <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
      </div>

      <div
        className="relative overflow-hidden rounded border bg-gray-50"
        style={{ height: "200px" }}
        title={`Preview of ${template.name} email template`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {emailHTML ? (
            <div className="h-full w-full overflow-hidden">
              <iframe
                srcDoc={emailHTML}
                className="h-[400%] w-[400%] origin-top-left scale-25 transform border-0"
                style={{
                  pointerEvents: "none",
                  background: "white",
                }}
                title={`${template.name} email preview`}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-sm text-gray-400">
              <div className="mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-gray-400"></div>
              <span>Loading preview...</span>
            </div>
          )}
        </div>

        {isHovered && emailHTML && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity">
            <Button
              size="sm"
              className="bg-white text-gray-900 hover:bg-gray-100"
              onClick={handlePreviewClick}
            >
              <Eye className="size-4" />
              Preview
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
