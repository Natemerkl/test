
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="text-6xl mb-8">😅</div>
        <h1 className="text-4xl font-bold mb-4">Oops! Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for seems to have wandered off on its own adventure! 
          Let's get you back on track. 🌟
        </p>
        <div className="space-y-4">
          <Button asChild size="lg" className="w-full">
            <Link to="/">
              Return Home 🏠
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link to="/campaigns">
              <Search className="mr-2 h-4 w-4" />
              Browse Campaigns
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
