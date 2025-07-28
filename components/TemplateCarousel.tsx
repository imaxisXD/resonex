import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import EmailTemplateCard from "./EmailTemplateCard";
import { TemplateCarouselProps } from "./types/email-template";

export default function TemplateCarousel({
  templates,
  emailHTMLs,
  selectedIndex,
  onTemplateSelect,
  onPreviewClick,
  onCarouselApiChange,
}: TemplateCarouselProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">Choose a template</h3>
          <p className="mt-1 text-xs text-gray-500">
            Click a template to preview it or edit it.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {selectedIndex + 1} of {templates.length}
        </div>
      </div>

      <Carousel
        setApi={onCarouselApiChange}
        opts={{
          align: "start",
          loop: false,
        }}
        plugins={[WheelGesturesPlugin()]}
      >
        <CarouselContent className="p-1 px-6">
          {templates.map((template, index) => (
            <CarouselItem key={template.id} className="basis-1/4 px-2">
              <EmailTemplateCard
                template={template}
                index={index}
                isSelected={selectedIndex === index}
                emailHTML={emailHTMLs[index]}
                onSelect={onTemplateSelect}
                onPreview={onPreviewClick}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
