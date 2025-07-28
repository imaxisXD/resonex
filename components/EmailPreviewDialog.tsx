import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import EmailPreview from "./EmailPreview";
import { EmailTemplate } from "./types/email-template";

interface EmailPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: EmailTemplate | null;
  emailHTML: string;
}

export default function EmailPreviewDialog({
  open,
  onOpenChange,
  template,
  emailHTML,
}: EmailPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="left-[45%] max-h-[80vh] max-w-4xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {template ? template.name : "Email Preview"}
          </DialogTitle>
          <DialogDescription>
            {template
              ? `Preview of ${template.name} template`
              : "Email template preview"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden rounded border bg-white">
          <EmailPreview
            html={emailHTML}
            templateName={template?.name || "Email"}
            className="h-[60vh] w-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
