import { CarouselApi } from "@/components/ui/carousel";

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  ctaText: string;
  ctaLink: string;
  type: "campaign" | "modern" | "promotional";
}

export interface EmailTemplateCardProps {
  template: EmailTemplate;
  index: number;
  isSelected: boolean;
  emailHTML: string;
  onSelect: (index: number) => void;
  onPreview: (index: number, event: React.MouseEvent) => void;
}

export interface EmailPreviewProps {
  html: string;
  templateName: string;
  className?: string;
}

export interface TemplateCarouselProps {
  templates: EmailTemplate[];
  emailHTMLs: string[];
  selectedIndex: number;
  onTemplateSelect: (index: number) => void;
  onPreviewClick: (index: number, event: React.MouseEvent) => void;
  onCarouselApiChange: (api: CarouselApi) => void;
}
