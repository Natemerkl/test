
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface CampaignDurationSectionProps {
  endDate: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CampaignDurationSection({
  endDate,
  onChange,
}: CampaignDurationSectionProps) {
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const event = {
        target: {
          name: 'endDate',
          value: format(date, 'yyyy-MM-dd')
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xl font-semibold text-primary mb-2">
        <CalendarIcon className="h-6 w-6" />
        <span>Campaign Duration ⏳</span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">End Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(new Date(endDate), "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white shadow-lg border border-gray-200" align="start">
            <Calendar
              mode="single"
              selected={endDate ? new Date(endDate) : undefined}
              onSelect={handleDateSelect}
              initialFocus
              className="bg-white rounded-lg"
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
