
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DonationPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: campaign } = useQuery({
    queryKey: ["campaign", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (!campaign) return null;

  const progress = Math.min(
    (campaign.current_amount / campaign.goal_amount) * 100,
    100
  );

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate("/auth/login");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("donations").insert({
        campaign_id: id,
        donor_id: user.id,
        amount: parseFloat(amount),
        payment_status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Thank you! 💝",
        description: "Your donation has been recorded. Proceeding to payment...",
      });

      // Here we'll redirect to the campaign details page for now
      // In a real app, this would go to a payment processor
      navigate(`/campaigns/${id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to={`/campaigns/${id}`} className="text-primary hover:underline mb-6 inline-block">
        ← Back to Campaign
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>
          <p className="text-gray-600 mb-6">{campaign.description}</p>
          
          <Card>
            <CardHeader>
              <CardTitle>Campaign Progress</CardTitle>
              <CardDescription>Help us reach our goal!</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="h-2 mb-4" />
              <div className="flex justify-between text-sm text-gray-600">
                <span className="font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "ETB",
                  }).format(campaign.current_amount)} raised
                </span>
                <span>
                  of {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "ETB",
                  }).format(campaign.goal_amount)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Make a Donation 💝</CardTitle>
            <CardDescription>Support this campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDonate} className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium mb-2">
                  Donation Amount (ETB)
                </label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount in ETB"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="1"
                  className="text-lg"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing... ⏳" : "Complete Donation 💝"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
