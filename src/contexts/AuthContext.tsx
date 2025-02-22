
import { createContext, useContext, useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  signOut: async () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch profile data
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error fetching profile",
          description: "Your profile information could not be loaded.",
          variant: "destructive",
        });
        return null;
      }

      // If no profile exists, create one
      if (!data) {
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([
            {
              id: user.id,
              full_name: user.user_metadata.full_name,
            },
          ])
          .select()
          .maybeSingle();

        if (createError) {
          console.error("Error creating profile:", createError);
          toast({
            title: "Error creating profile",
            description: "We couldn't create your profile. Please try again later.",
            variant: "destructive",
          });
          return null;
        }

        return newProfile;
      }

      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Update admin status when profile changes
  useEffect(() => {
    if (profile?.is_admin) {
      setIsAdmin(true);
      if (window.location.pathname !== "/admin") {
        navigate("/admin");
        toast({
          title: "Welcome Admin!",
          description: "You've been redirected to the admin dashboard.",
        });
      }
    } else {
      setIsAdmin(false);
    }
  }, [profile, navigate, toast]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear all state
      setUser(null);
      setIsAdmin(false);
      queryClient.clear();

      // Show success message
      toast({
        title: "Signed out successfully",
        description: "See you soon! 👋",
      });

      // Redirect to login
      navigate("/auth/login");
    } catch (error: any) {
      console.error("Error signing out:", error.message);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
