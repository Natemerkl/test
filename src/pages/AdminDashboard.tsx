
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { CampaignManagement } from "@/components/admin/CampaignManagement";
import { RecentDonations } from "@/components/admin/RecentDonations";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserManagement } from "@/components/admin/UserManagement";
import { TestimonialManagement } from "@/components/admin/TestimonialManagement";

export default function AdminDashboard() {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      toast({
        title: "Access Denied",
        description: "You must be an admin to view this page.",
        variant: "destructive",
      });
    }
  }, [isAdmin, navigate, toast]);

  const { data: campaigns, refetch: refetchCampaigns } = useQuery({
    queryKey: ["admin-campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select(`
          *,
          creator:profiles(full_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Tables<"campaigns">[];
    },
    enabled: isAdmin,
  });

  const { data: donations } = useQuery({
    queryKey: ["admin-donations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donations")
        .select(`
          *,
          campaigns(title),
          donor:profiles(full_name)
        `)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const handleUpdateStatus = async (campaignId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("campaigns")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", campaignId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Campaign status has been updated to ${newStatus}`,
      });

      refetchCampaigns();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!isAdmin || !user) {
    return null;
  }

  const totalRaised = donations?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;
  const pendingCampaigns = campaigns?.filter(c => c.status === "pending").length || 0;
  const activeCampaigns = campaigns?.filter(c => c.status === "active").length || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-8">Admin Dashboard</h1>
      
      <DashboardStats 
        totalRaised={totalRaised}
        activeCampaigns={activeCampaigns}
        pendingCampaigns={pendingCampaigns}
      />

      <Tabs defaultValue="campaigns" className="mt-8">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="mt-4">
          <CampaignManagement 
            campaigns={campaigns || []}
            onUpdateStatus={handleUpdateStatus}
          />
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <UserManagement />
        </TabsContent>

        <TabsContent value="testimonials" className="mt-4">
          <TestimonialManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
