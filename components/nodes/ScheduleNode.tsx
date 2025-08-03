"use client";
import { CalendarClock, CalendarCog } from "lucide-react";
import { CampaignNodeData } from "@/lib/connection-rules";
import { memo, useState } from "react";
import { CalendarDate } from "../calendar-date";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { buttonVariants } from "../ui/button";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";

interface ScheduleNodeProps {
  data: CampaignNodeData;
}

export const ScheduleNode = memo(function ScheduleNode({}: ScheduleNodeProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <div className="relative z-30 w-[280px] rounded-lg border bg-white/90 p-4 shadow-md backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-blue-500 bg-gradient-to-t from-blue-50 to-white">
          <CalendarClock className="size-5 text-blue-500" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium">Scheduler</h3>
          <p className="text-muted-foreground text-xs capitalize">
            <span
              className={`mr-1 inline-block h-1.5 w-1.5 rounded-full border ${
                selectedTime
                  ? "border-green-600 bg-green-500"
                  : "border-yellow-600 bg-yellow-400"
              } align-middle`}
            />
            {selectedTime ? "Ready" : "Pending"}
          </p>
        </div>
      </div>
      <div className="mb-3 space-y-2 text-xs">
        <p className="text-muted-foreground">
          Select the date and time for the campaign to start.
        </p>
        {date && selectedTime && (
          <div className="mt-3 rounded-lg border-2 border-dashed bg-gray-50 p-3">
            <div className="space-y-2">
              <div>
                <span className="text-muted-foreground text-xs">Date:</span>
                <p className="text-xs font-medium">
                  {date.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Time:</span>
                <p className="text-xs font-medium">{selectedTime}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          title="Select Date & Time"
          className={cn(
            buttonVariants({ variant: "default" }),
            "h-9 w-full rounded-sm",
          )}
        >
          <CalendarCog className="size-4" />
          Select Date & Time
        </DialogTrigger>
        <DialogContent className="left-[47%] w-full !max-w-[40rem] bg-white">
          <DialogHeader>
            <DialogTitle>Select Date and time</DialogTitle>
            <DialogDescription>
              Select the date and time for the campaign to start. The campaign
              will start at the selected time on the selected date.
            </DialogDescription>
            <CalendarDate
              close={() => setOpen(false)}
              onSelect={(date) => {
                console.log("selected date and time", date);
              }}
              date={date}
              setDate={setDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: "var(--color-blue-500)",
          height: "10px",
          width: "10px",
          border: "1px solid var(--color-blue-700)",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "var(--color-blue-500)",
          height: "10px",
          width: "10px",
          border: "1px solid var(--color-blue-700)",
        }}
      />
    </div>
  );
});
