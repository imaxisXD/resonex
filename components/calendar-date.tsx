"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { addMinutes, format, isSameDay, parse } from "date-fns";

export function CalendarDate({
  onSelect,
  close,
  date,
  setDate,
  selectedTime,
  setSelectedTime,
}: {
  onSelect: (date: string) => void;
  close: () => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  selectedTime: string | null;
  setSelectedTime: (time: string | null) => void;
}) {
  const bookedDates = React.useMemo(
    () => Array.from({ length: 3 }, (_, i) => new Date(2025, 5, 17 + i)),
    [],
  );

  const timeSlots = React.useMemo(() => {
    const now = new Date();
    const selectedDate = date || new Date();
    const isToday = isSameDay(selectedDate, now);
    const availableSlots: string[] = [];

    if (isToday) {
      // For today, start exactly 5 minutes from now, then continue with 15-minute intervals
      let currentSlot = addMinutes(now, 5);

      // Generate slots until end of day (11:30 PM)
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 30, 0, 0);

      while (currentSlot <= endOfDay) {
        availableSlots.push(format(currentSlot, "h:mm a"));
        currentSlot = addMinutes(currentSlot, 15);
      }
    } else {
      // For future dates, show all slots from 12:00 AM to 11:30 PM
      let currentSlot = new Date(selectedDate);
      currentSlot.setHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 30, 0, 0);

      while (currentSlot <= endOfDay) {
        availableSlots.push(format(currentSlot, "h:mm a"));
        currentSlot = addMinutes(currentSlot, 15);
      }
    }

    return availableSlots;
  }, [date]);

  const isDateDisabled = React.useCallback(
    (checkDate: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const compareDate = new Date(checkDate);
      compareDate.setHours(0, 0, 0, 0);
      return (
        compareDate < today ||
        bookedDates.some(
          (bookedDate) =>
            bookedDate.toDateString() === compareDate.toDateString(),
        )
      );
    },
    [bookedDates],
  );

  React.useEffect(() => {
    setSelectedTime(null);
  }, [date]);

  const handleSubmit = () => {
    if (!date || !selectedTime) return;
    const timeDate = parse(selectedTime, "h:mm a", new Date());
    const localDateTime = new Date(date);
    localDateTime.setHours(timeDate.getHours(), timeDate.getMinutes(), 0, 0);
    const utcData = {
      utc: localDateTime.toISOString(),
      local: localDateTime.toLocaleString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    onSelect(utcData.utc);
    close();
  };

  return (
    <Card className="gap-0 p-0">
      <CardContent className="relative p-0 md:pr-48">
        <section className="p-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            defaultMonth={date}
            disabled={isDateDisabled}
            showOutsideDays={false}
            modifiers={{
              booked: bookedDates,
            }}
            modifiersClassNames={{
              booked: "[&>button]:line-through opacity-100",
            }}
            className="bg-transparent p-0 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
            formatters={{
              formatWeekdayName: (date) => {
                return date.toLocaleString("en-US", { weekday: "short" });
              },
            }}
          />
        </section>
        <aside className="no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l">
          <div className="grid gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                onClick={() => setSelectedTime(time)}
                className="w-full shadow-none"
                aria-pressed={selectedTime === time}
                type="button"
              >
                {time}
              </Button>
            ))}
          </div>
        </aside>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t px-6 !py-5 md:flex-row">
        <div className="text-sm" aria-live="polite">
          {date && selectedTime ? (
            <>
              Your email is scheduled for{" "}
              <span className="font-medium">
                {date?.toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
              {" at "}
              <span className="font-medium">{selectedTime}</span>.
            </>
          ) : (
            <>Select a date and time for your meeting.</>
          )}
        </div>
        <Button
          disabled={!date || !selectedTime}
          className="w-full md:ml-auto md:w-auto"
          onClick={handleSubmit}
          type="button"
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
