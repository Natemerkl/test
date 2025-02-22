
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Testimonial {
  id: string;
  content: string;
  role: string | null;
  status: string;
  is_featured: boolean;
  user: { full_name: string } | null;
}

export function TestimonialManagement() {
  const { toast } = useToast();

  const { data: testimonials, refetch } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select(`
          *,
          user:profiles(full_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Testimonial[];
    },
  });

  const handleUpdateStatus = async (testimonialId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", testimonialId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Testimonial has been ${newStatus}`,
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleFeatured = async (testimonialId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .update({ 
          is_featured: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", testimonialId);

      if (error) throw error;

      toast({
        title: "Featured Status Updated",
        description: `Testimonial has been ${!currentStatus ? 'featured' : 'unfeatured'}`,
      });

      refetch();
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
        <CardTitle>Testimonial Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials?.map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell>{testimonial.user?.full_name || "Anonymous"}</TableCell>
                  <TableCell>{testimonial.role}</TableCell>
                  <TableCell className="max-w-md truncate">{testimonial.content}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        testimonial.status === "approved" 
                          ? "default"
                          : testimonial.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {testimonial.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {testimonial.status === "pending" && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleUpdateStatus(testimonial.id, "approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleUpdateStatus(testimonial.id, "rejected")}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleFeatured(testimonial.id, !!testimonial.is_featured)}
                      >
                        {testimonial.is_featured ? "Unfeature" : "Feature"}
                      </Button>
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
