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
            "glass-dark hover:opacity-90 rounded-[4px]",
            !dateRange && "text-white/30"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-[#9ED8F5]" />
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
        className="w-auto p-0 glass-dropdown border-0"
        align="start"
      >
        <div className="flex">
          <div className="border-r border-[rgba(26,26,26,0.08)] p-3 space-y-1 min-w-[140px]">
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#75726B] mb-2 px-2">Presets</p>
            {presets.map((preset) => (
              <button
                key={preset.days}
                onClick={() => handlePreset(preset.days)}
                className="block w-full text-left text-sm px-2 py-1.5 rounded-[4px] text-[#1A1A1A] hover:bg-[#9ED8F5]/20 transition-all duration-150 cursor-pointer"
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
              caption_label: "text-sm font-medium text-[#1A1A1A]",
              nav_button: "h-7 w-7 bg-transparent p-0 text-[#75726B] hover:text-[#1A1A1A] hover:bg-white/60 rounded-[4px] inline-flex items-center justify-center transition-colors",
              head_cell: "text-[#75726B] rounded-[4px] w-9 font-mono text-[10px] uppercase tracking-[0.15em]",
              day: "h-9 w-9 p-0 font-normal text-[#1A1A1A] hover:bg-[#9ED8F5]/20 rounded-[4px] inline-flex items-center justify-center transition-colors aria-selected:opacity-100 cursor-pointer",
              day_selected: "bg-[#1A1A1A] text-[#F7F6F3] hover:bg-[#1A1A1A] hover:text-[#F7F6F3] focus:bg-[#1A1A1A] focus:text-[#F7F6F3]",
              day_today: "bg-white/70 text-[#1A1A1A] ring-1 ring-[#9ED8F5]/60",
              day_outside: "text-[#9A988F] aria-selected:text-[#75726B]",
              day_disabled: "text-[#C2BFB6] opacity-50 cursor-not-allowed",
              day_range_middle: "aria-selected:bg-[#9ED8F5]/25 aria-selected:text-[#1A1A1A] rounded-none",
              day_range_start: "aria-selected:bg-[#1A1A1A] aria-selected:text-[#F7F6F3] rounded-l-[4px]",
              day_range_end: "aria-selected:bg-[#1A1A1A] aria-selected:text-[#F7F6F3] rounded-r-[4px]",
              cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
