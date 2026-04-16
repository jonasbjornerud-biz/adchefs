import { useState } from "react";
import { format, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

const presets = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 14 days", days: 14 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
  { label: "Last 6 months", days: 180 },
  { label: "Last year", days: 365 },
];

export function DateRangePicker({ dateRange, onDateRangeChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const handlePreset = (days: number) => {
    const to = new Date();
    const from = subDays(to, days - 1);
    onDateRangeChange({ from, to });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal h-9 px-3 text-sm cursor-pointer transition-all duration-200",
            "bg-[#111118] border-white/10 text-white/60 hover:bg-white/[0.04] hover:text-white/80",
            !dateRange && "text-white/30"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-[#a855f7]" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "MMM d, yyyy")} – {format(dateRange.to, "MMM d, yyyy")}
              </>
            ) : (
              format(dateRange.from, "MMM d, yyyy")
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-[#111118] border-white/10 backdrop-blur-xl"
        align="start"
      >
        <div className="flex">
          <div className="border-r border-white/[0.06] p-3 space-y-1 min-w-[140px]">
            <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-2">Presets</p>
            {presets.map((preset) => (
              <button
                key={preset.days}
                onClick={() => handlePreset(preset.days)}
                className="block w-full text-left text-sm px-2 py-1.5 rounded-md text-white/60 hover:text-white hover:bg-[#a855f7]/10 transition-all duration-200 cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
            className={cn("p-3 pointer-events-auto")}
            disabled={(date) => date > new Date()}
            classNames={{
              caption_label: "text-sm font-medium text-white",
              nav_button: "h-7 w-7 bg-transparent p-0 text-white/70 hover:text-white hover:bg-white/[0.06] rounded-md inline-flex items-center justify-center transition-colors",
              head_cell: "text-white/40 rounded-md w-9 font-normal text-[0.7rem] uppercase tracking-wider",
              day: "h-9 w-9 p-0 font-normal text-white/85 hover:bg-[#a855f7]/15 hover:text-white rounded-md inline-flex items-center justify-center transition-colors aria-selected:opacity-100 cursor-pointer",
              day_selected: "bg-[#a855f7] text-white hover:bg-[#a855f7] hover:text-white focus:bg-[#a855f7] focus:text-white",
              day_today: "bg-white/[0.08] text-white ring-1 ring-[#a855f7]/40",
              day_outside: "text-white/25 aria-selected:text-white/40",
              day_disabled: "text-white/20 opacity-50 cursor-not-allowed",
              day_range_middle: "aria-selected:bg-[#a855f7]/20 aria-selected:text-white rounded-none",
              day_range_start: "aria-selected:bg-[#a855f7] aria-selected:text-white rounded-l-md",
              day_range_end: "aria-selected:bg-[#a855f7] aria-selected:text-white rounded-r-md",
              cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
