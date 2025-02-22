
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tables } from "@/integrations/supabase/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Heart, Calendar, Tag, Users } from "lucide-react";

export default function CampaignDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [donationAmount, setDonationAmount] = useState("");

  const { data: campaign, isLoading } = useQuery({
    queryKey: ["campaign", id],
    queryFn: async () => {
      if (!id) throw new Error("Campaign ID is required");
      
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Tables<"campaigns">;
    },
  });

  const calculateProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
    }).format(amount);
  };

  const handleDonate = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to make a donation",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid donation amount",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create the donation record
      const { error: donationError } = await supabase
        .from("donations")
        .insert([{
          campaign_id: id,
          donor_id: user.id,
          amount: amount,
          payment_status: "completed", // In a real app, this would be set after payment confirmation
        }]);

      if (donationError) throw donationError;

      // Update the campaign's current amount
      const { error: updateError } = await supabase
        .from("campaigns")
        .update({ 
          current_amount: (campaign?.current_amount || 0) + amount 
        })
        .eq("id", id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Thank you for your donation! 💝",
      });
      
      setDonationAmount("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-600">Loading campaign details... ✨</p>
      </div>
    </div>
  );

  if (!campaign) return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Campaign Not Found 😢</h1>
      <p className="text-gray-600 mb-6">The campaign you're looking for doesn't exist.</p>
      <Button asChild>
        <Link to="/campaigns">Browse Other Campaigns 🔍</Link>
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/campaigns" className="text-primary hover:underline mb-4 block">
        ← Back to Campaigns
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {campaign.image_url && (
            <img
              src={campaign.image_url}
              alt={campaign.title}
              className="w-full h-96 object-cover rounded-lg mb-6"
            />
          )}
          <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>
          <p className="text-gray-600 mb-6">{campaign.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="font-semibold">{formatCurrency(campaign.current_amount)}</div>
                  <div className="text-sm text-gray-500">Raised</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Tag className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="font-semibold">{formatCurrency(campaign.goal_amount)}</div>
                  <div className="text-sm text-gray-500">Goal</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="font-semibold">
                    {new Date(campaign.end_date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">End Date</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="font-semibold">{campaign.category}</div>
                  <div className="text-sm text-gray-500">Category</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Support this Campaign 💝</CardTitle>
              <CardDescription>Help make this project a reality!</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress
                value={calculateProgress(
                  campaign.current_amount,
                  campaign.goal_amount
                )}
                className="mb-4"
              />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Raised</span>
                  <span className="font-bold">
                    {formatCurrency(campaign.current_amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Goal</span>
                  <span>{formatCurrency(campaign.goal_amount)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <Input
                  type="number"
                  placeholder="Enter amount in ETB 💰"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
                <Button 
                  className="w-full" 
                  onClick={handleDonate}
                >
                  Donate Now 🎁
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle>Share this Campaign 🌟</CardTitle>
              <CardDescription>Help spread the word!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                Share on Facebook 📱
              </Button>
              <Button className="w-full" variant="outline">
                Share on Twitter 🐦
              </Button>
              <Button className="w-full" variant="outline">
                Copy Link 🔗
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
