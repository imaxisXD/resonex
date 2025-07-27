import { Settings } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface ContentGenerationDrawerProps {
  campaign: Doc<"campaigns">;
}

export default function ContentGenerationDrawer({
  campaign,
}: ContentGenerationDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          className="rounded border border-yellow-300 bg-yellow-100 px-2 py-1 text-xs hover:bg-yellow-200"
          title="Configure generation settings"
        >
          <Settings className="size-3" />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Content Generation Settings</DrawerTitle>
          <DrawerDescription>
            Configure the settings for generating content for this campaign.
          </DrawerDescription>
        </DrawerHeader>
        <div className="space-y-4 p-4">
          <div>
            <h4 className="mb-2 font-medium">Campaign Details</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Name:</span>{" "}
                {campaign.campaignName}
              </div>
              <div>
                <span className="font-medium">Category:</span>{" "}
                {campaign.category}
              </div>
              <div>
                <span className="font-medium">Status:</span> {campaign.status}
              </div>
              <div>
                <span className="font-medium">Prompt:</span>
                <p className="mt-1 max-h-20 overflow-y-auto text-gray-600">
                  {campaign.prompt}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Generation Status</h4>
            <div className="text-sm text-gray-600">
              Content generation is currently pending. The system will
              automatically generate subject lines and email body based on your
              campaign settings.
            </div>
          </div>
        </div>
        <div className="p-4 pt-0">
          <DrawerClose asChild>
            <button className="w-full rounded bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200">
              Close
            </button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
