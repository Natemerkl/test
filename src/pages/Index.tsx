
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CampaignCard } from "@/components/CampaignCard";

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: campaigns } = useQuery({
    queryKey: ["featured-campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      return data;
    }
  });

  const handleStartCampaign = () => {
    if (!user) {
      navigate("/auth/login");
    } else {
      navigate("/campaigns/create");
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Empowering Ethiopian <span className="text-primary">Innovation</span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Join the movement to support and fund the next generation of Ethiopian creators, entrepreneurs, and changemakers.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white px-8 rounded-full"
            onClick={handleStartCampaign}
          >
            Start Your Campaign
          </Button>
          <Button 
            asChild 
            variant="outline" 
            size="lg"
            className="px-8 rounded-full"
          >
            <Link to="/campaigns">Explore Projects</Link>
          </Button>
        </div>
      </div>

      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Campaigns</h2>
          <p className="text-gray-600">
            Discover innovative projects making a difference in Ethiopia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns?.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              id={campaign.id}
              title={campaign.title}
              description={campaign.description}
              imageUrl={campaign.image_url}
              currentAmount={campaign.current_amount}
              goalAmount={campaign.goal_amount}
              donationsCount={campaign.donations_count || 0}
              category={campaign.category}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
