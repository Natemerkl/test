
import { Image } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CampaignMediaSectionProps {
  selectedImage: File | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CampaignMediaSection({
  selectedImage,
  onImageChange,
}: CampaignMediaSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xl font-semibold text-primary mb-2">
        <Image className="h-6 w-6" />
        <span>Campaign Media 🖼️</span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Campaign Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="transition-all hover:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {selectedImage && (
          <p className="text-sm text-gray-500">
            Selected: {selectedImage.name}
          </p>
        )}
      </div>
    </div>
  );
}
