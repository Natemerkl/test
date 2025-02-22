
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Heart } from "lucide-react";

export default function CampaignsList() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Tables<"campaigns">[];
    },
  });

  const filteredCampaigns = campaigns?.filter(
    (campaign) =>
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
    }).format(amount);
  };

  const calculateProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: { [key: string]: string } = {
      Education: "📚",
      Healthcare: "⚕️",
      Emergency: "🚨",
      Community: "🤝",
      Business: "💼",
      Creative: "🎨",
      Other: "✨"
    };
    return emojis[category] || "🌟";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Discover Amazing Campaigns ✨</h1>
        <p className="text-lg text-gray-600 mb-8">
          Support incredible causes and help make dreams come true 💝
        </p>
        <Button asChild size="lg" className="animate-pulse">
          <Link to="/campaigns/create">Start Your Own Campaign 🚀</Link>
        </Button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="search"
          placeholder="Search campaigns... 🔍"
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <Sparkles className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading amazing campaigns... ✨</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns?.map((campaign) => (
            <Card key={campaign.id} className="group hover:shadow-lg transition-shadow">
              {campaign.image_url && (
                <img
                  src={campaign.image_url}
                  alt={campaign.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                  {campaign.title}
                </CardTitle>
                <CardDescription>
                  {getCategoryEmoji(campaign.category)} {campaign.category}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {campaign.description}
                </p>
                <div className="mt-4">
                  <Progress
                    value={calculateProgress(
                      campaign.current_amount,
                      campaign.goal_amount
                    )}
                    className="h-2"
                  />
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="font-semibold">
                      {formatCurrency(campaign.current_amount)}
                    </span>
                    <span className="text-gray-600">
                      of {formatCurrency(campaign.goal_amount)}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full group-hover:bg-primary-dark transition-colors">
                  <Link to={`/campaigns/${campaign.id}`}>
                    Support This Campaign 💝
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
