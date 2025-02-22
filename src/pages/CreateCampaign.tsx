
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CampaignDetailsSection } from "@/components/campaign-create/CampaignDetailsSection";
import { FundingGoalsSection } from "@/components/campaign-create/FundingGoalsSection";
import { CampaignMediaSection } from "@/components/campaign-create/CampaignMediaSection";
import { CampaignDurationSection } from "@/components/campaign-create/CampaignDurationSection";

export default function CreateCampaign() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    category: "",
    endDate: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a campaign",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = null;

      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('campaign-images')
          .upload(fileName, selectedImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('campaign-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const { error } = await supabase.from("campaigns").insert({
        title: formData.title,
        description: formData.description,
        goal_amount: parseFloat(formData.goalAmount),
        category: formData.category,
        end_date: new Date(formData.endDate).toISOString(),
        creator_id: user.id,
        image_url: imageUrl,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Success! 🎉",
        description: "Your campaign has been created and is pending approval.",
      });

      navigate("/campaigns");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Start Your Campaign 🚀</h1>
          <p className="text-lg text-gray-600">
            Create your fundraising campaign and start making a difference today ✨
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <CampaignDetailsSection
              title={formData.title}
              description={formData.description}
              onChange={handleChange}
            />

            <FundingGoalsSection
              goalAmount={formData.goalAmount}
              category={formData.category}
              onAmountChange={handleChange}
              onCategoryChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            />

            <CampaignMediaSection
              selectedImage={selectedImage}
              onImageChange={handleImageChange}
            />

            <CampaignDurationSection
              endDate={formData.endDate}
              onChange={handleChange}
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 text-lg font-semibold"
              >
                {loading ? "Creating... ⏳" : "Launch Campaign 🚀"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/campaigns")}
                className="h-12 text-lg font-semibold"
              >
                Cancel ↩️
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
