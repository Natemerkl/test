
import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Eye, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CampaignManagementProps {
  campaigns: Tables<"campaigns">[];
  onUpdateStatus: (campaignId: string, newStatus: string) => Promise<void>;
}

export function CampaignManagement({ campaigns, onUpdateStatus }: CampaignManagementProps) {
  const [editingCampaign, setEditingCampaign] = useState<Tables<"campaigns"> | null>(null);
  const { toast } = useToast();

  const handleDeleteCampaign = async (campaignId: string) => {
  if (!confirm("Are you sure you want to delete this campaign? This action cannot be undone.")) {
    return;
  }

  try {
    const { error } = await supabase
      .from("campaigns")
      .delete()
      .eq("id", campaignId);

    if (error) throw error;

    toast({
      title: "Success",
      description: "Campaign deleted successfully",
    });
    
    window.location.reload();
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  }
};

const handleSaveEdit = async () => {
    if (!editingCampaign) return;

    try {
      const { error } = await supabase
        .from("campaigns")
        .update({
          title: editingCampaign.title,
          description: editingCampaign.description,
          goal_amount: editingCampaign.goal_amount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingCampaign.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Campaign updated successfully",
      });
      
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Management</CardTitle>
        <CardDescription>Review and manage campaign statuses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Goal</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns?.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        campaign.status === "active"
                          ? "default"
                          : campaign.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "ETB",
                    }).format(campaign.goal_amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingCampaign(campaign)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Campaign</DialogTitle>
                          </DialogHeader>
                          {editingCampaign && (
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                  value={editingCampaign.title}
                                  onChange={(e) =>
                                    setEditingCampaign({
                                      ...editingCampaign,
                                      title: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                  value={editingCampaign.description}
                                  onChange={(e) =>
                                    setEditingCampaign({
                                      ...editingCampaign,
                                      description: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Goal Amount (ETB)</label>
                                <Input
                                  type="number"
                                  value={editingCampaign.goal_amount}
                                  onChange={(e) =>
                                    setEditingCampaign({
                                      ...editingCampaign,
                                      goal_amount: parseFloat(e.target.value),
                                    })
                                  }
                                />
                              </div>
                              <div className="flex justify-between">
                                <Button onClick={handleSaveEdit}>Save Changes</Button>
                                <Button 
                                  variant="destructive"
                                  onClick={() => handleDeleteCampaign(campaign.id)}
                                >
                                  Delete Campaign
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      {campaign.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => onUpdateStatus(campaign.id, "active")}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onUpdateStatus(campaign.id, "rejected")}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
