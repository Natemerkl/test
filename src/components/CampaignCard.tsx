
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface CampaignCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  currentAmount: number;
  goalAmount: number;
  donationsCount: number;
  category: string;
}

export function CampaignCard({
  id,
  title,
  description,
  imageUrl,
  currentAmount,
  goalAmount,
  donationsCount,
  category,
}: CampaignCardProps) {
  const progress = Math.min((currentAmount / goalAmount) * 100, 100);

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <Link to={`/campaigns/${id}`} className="block">
        <div className="relative">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Heart className="w-4 h-4 text-primary" />
            {donationsCount} donations
          </div>
        </div>
      </Link>
      <CardContent className="p-6">
        <div className="text-primary text-sm font-medium mb-2">{category}</div>
        <Link to={`/campaigns/${id}`}>
          <h3 className="text-xl font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="space-y-3">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "ETB",
              }).format(currentAmount)} raised
            </span>
            <span className="text-gray-600">{Math.round(progress)}%</span>
          </div>
          
          <Button asChild className="w-full">
            <Link to={`/campaigns/${id}/donate`}>Donate Now 💝</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
