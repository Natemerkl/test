
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function Testimonials() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: testimonials } = useQuery({
    queryKey: ["public-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select(`
          *,
          user:profiles(full_name)
        `)
        .eq("status", "approved")
        .eq("is_featured", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleAddTestimonial = async () => {
    if (!user) {
      navigate("/auth/login");
      return;
    }

    try {
      const { error } = await supabase
        .from("testimonials")
        .insert({
          user_id: user.id,
          content: prompt("Please share your experience:"),
          status: "pending",
          is_featured: false,
        });

      if (error) throw error;

      alert("Thank you for your testimonial! It will be reviewed by our team.");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Success Stories 💫</h1>
        <p className="text-lg text-gray-600">
          Hear from our amazing community of campaign creators and supporters
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials?.map((testimonial) => (
          <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                  {testimonial.user?.full_name?.[0] || "A"}
                </div>
                <div>
                  <h3 className="font-semibold">{testimonial.user?.full_name || "Anonymous"}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role || "Community Member"}</p>
                </div>
              </div>
              <p className="text-gray-600">{testimonial.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center space-y-4">
        <Button onClick={handleAddTestimonial}>
          Share Your Story ✨
        </Button>
        
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Campaign? 🚀</h2>
          <p className="text-gray-600 mb-6">
            Join our community of successful fundraisers and make your dreams a reality
          </p>
          <Button 
            className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            onClick={() => navigate('/campaigns/create')}
          >
            Start Fundraising Now ✨
          </Button>
        </div>
      </div>
    </div>
  );
}
