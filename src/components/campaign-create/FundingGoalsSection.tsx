
import { Target } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  { value: "Education", label: "Education 📚", icon: "🎓" },
  { value: "Healthcare", label: "Healthcare 🏥", icon: "⚕️" },
  { value: "Emergency", label: "Emergency 🚨", icon: "🆘" },
  { value: "Community", label: "Community 🤝", icon: "👥" },
  { value: "Business", label: "Business 💼", icon: "📈" },
  { value: "Creative", label: "Creative 🎨", icon: "🎯" },
  { value: "Other", label: "Other 🌟", icon: "✨" },
];

interface FundingGoalsSectionProps {
  goalAmount: string;
  category: string;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (value: string) => void;
}

export function FundingGoalsSection({
  goalAmount,
  category,
  onAmountChange,
  onCategoryChange,
}: FundingGoalsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xl font-semibold text-primary mb-2">
        <Target className="h-6 w-6" />
        <span>Funding Goals 🎯</span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="goalAmount">Target Amount</Label>
        <Input
          id="goalAmount"
          name="goalAmount"
          type="number"
          min="0"
          step="0.01"
          value={goalAmount}
          onChange={onAmountChange}
          className="transition-all hover:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="Set your fundraising goal 💰"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Campaign Category</Label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full bg-white border border-gray-300 transition-all hover:border-primary focus:ring-2 focus:ring-primary/20">
            <SelectValue placeholder="Select a category 📂" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                <span className="flex items-center gap-2">
                  <span>{category.icon}</span>
                  {category.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
