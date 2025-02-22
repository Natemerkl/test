
import { PenLine } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CampaignDetailsSectionProps {
  title: string;
  description: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function CampaignDetailsSection({
  title,
  description,
  onChange,
}: CampaignDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xl font-semibold text-primary mb-2">
        <PenLine className="h-6 w-6" />
        <span>Campaign Details 📝</span>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="title">Campaign Title</Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={onChange}
          className="transition-all hover:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="Give your campaign a catchy title ✨"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Campaign Story</Label>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={onChange}
          className="min-h-[150px] transition-all hover:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="Tell your story and inspire others to support your cause 💝"
          required
        />
      </div>
    </div>
  );
}
