"use client";
import { Mail } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import { useState, useEffect, useRef } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { type CarouselApi } from "@/components/ui/carousel";
import TemplateCarousel from "./TemplateCarousel";
import EmailPreviewDialog from "./EmailPreviewDialog";
import {
  getEmailTemplates,
  generateAllEmailHTMLs,
} from "./utils/email-templates";
import { EmailTemplate } from "./types/email-template";

interface SelectedTemplateInfo {
  template: EmailTemplate;
  templateIndex: number;
  emailHTML: string;
}

interface ContentGenerationDrawerProps {
  campaign: Doc<"campaigns">;
  onTemplateSelect?: (templateInfo: SelectedTemplateInfo) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  hideTitle?: boolean;
  showTrigger?: boolean;
  initialTemplateIndex?: number;
}

export default function ContentGenerationDrawer({
  campaign,
  onTemplateSelect,
  open,
  onOpenChange,
  title,
  showTrigger = true,
  initialTemplateIndex = 0,
}: ContentGenerationDrawerProps) {
  const [selectedTemplateIndex, setSelectedTemplateIndex] =
    useState(initialTemplateIndex);
  const [emailHTMLs, setEmailHTMLs] = useState<string[]>([]);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewTemplateIndex, setPreviewTemplateIndex] = useState<
    number | null
  >(null);
  const initializingRef = useRef(false);

  const emailTemplates = getEmailTemplates(campaign);

  useEffect(() => {
    const generateEmailHTMLs = async () => {
      const htmls = await generateAllEmailHTMLs(emailTemplates, campaign);
      setEmailHTMLs(htmls);
    };
    generateEmailHTMLs();
  }, [campaign.campaignName, campaign.category]);

  useEffect(() => {
    if (open && carouselApi && !initializingRef.current) {
      initializingRef.current = true;
      setSelectedTemplateIndex(initialTemplateIndex);
      carouselApi.scrollTo(initialTemplateIndex);
      setTimeout(() => (initializingRef.current = false), 150);
    }
  }, [open, carouselApi, initialTemplateIndex]);

  useEffect(() => {
    if (!open) {
      initializingRef.current = false;
    }
  }, [open]);

  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      if (!initializingRef.current) {
        setSelectedTemplateIndex(carouselApi.selectedScrollSnap());
      }
    };

    carouselApi.on("select", onSelect);

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  const handleTemplateSelect = (index: number) => {
    setSelectedTemplateIndex(index);
    if (carouselApi) {
      carouselApi.scrollTo(index);
    }
  };

  const handlePreviewClick = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setPreviewTemplateIndex(index);
    setPreviewDialogOpen(true);
  };

  const handleUseTemplate = () => {
    const selectedTemplate = emailTemplates[selectedTemplateIndex];
    const selectedHTML = emailHTMLs[selectedTemplateIndex];

    if (onTemplateSelect && selectedTemplate && selectedHTML) {
      onTemplateSelect({
        template: selectedTemplate,
        templateIndex: selectedTemplateIndex,
        emailHTML: selectedHTML,
      });
    }

    onOpenChange?.(false);
  };

  const previewTemplate =
    previewTemplateIndex !== null ? emailTemplates[previewTemplateIndex] : null;
  const previewHTML =
    previewTemplateIndex !== null ? emailHTMLs[previewTemplateIndex] : "";

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {showTrigger && (
        <DrawerTrigger asChild>
          <Button
            title="Configure generation settings"
            className="h-9 w-full rounded-md"
          >
            <Mail className="size-4" /> {title || "Choose Template"}
          </Button>
        </DrawerTrigger>
      )}
      <DrawerContent className="max-h-[70vh] bg-white">
        <DrawerHeader>
          <DrawerTitle>Email Templates</DrawerTitle>
          <DrawerDescription>
            Choose from our collection of email templates.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex border-b" />

        <div className="flex flex-1 items-center justify-center overflow-y-auto py-4">
          <TemplateCarousel
            templates={emailTemplates}
            emailHTMLs={emailHTMLs}
            selectedIndex={selectedTemplateIndex}
            onTemplateSelect={handleTemplateSelect}
            onPreviewClick={handlePreviewClick}
            onCarouselApiChange={setCarouselApi}
          />
        </div>

        <div className="border-t p-4">
          <div className="flex flex-col items-center justify-between gap-2">
            <Button onClick={handleUseTemplate}>Use This Template</Button>
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="bg-accent h-9 rounded-md border border-gray-300 px-14 hover:bg-gray-200"
              >
                Close
              </Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>

      <EmailPreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        template={previewTemplate}
        emailHTML={previewHTML}
      />
    </Drawer>
  );
}
