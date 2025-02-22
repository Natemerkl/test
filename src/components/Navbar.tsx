import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="text-2xl font-extrabold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent flex items-center gap-2"
          >
            <span className="rounded-lg p-1">
              YEGNA
            </span>
            <span className="text-primary">🚀</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Button variant="ghost" asChild>
                    <Link to="/campaigns">Campaigns</Link>
                  </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button variant="ghost" asChild>
                    <Link to="/how-it-works">How It Works</Link>
                  </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button variant="ghost" asChild>
                    <Link to="/about">About</Link>
                  </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button variant="ghost" asChild>
                    <Link to="/testimonials">Testimonials</Link>
                  </Button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center space-x-2">
              {user ? (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/profile">Profile</Link>
                  </Button>
                  <Button variant="ghost" onClick={signOut}>
                    Sign Out
                  </Button>
                  <Button asChild>
                    <Link to="/campaigns/create">Start Campaign</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/auth/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/auth/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-2">
              <Button variant="ghost" asChild className="justify-start">
                <Link to="/campaigns">Campaigns</Link>
              </Button>
              <Button variant="ghost" asChild className="justify-start">
                <Link to="/how-it-works">How It Works</Link>
              </Button>
              <Button variant="ghost" asChild className="justify-start">
                <Link to="/about">About</Link>
              </Button>
              <Button variant="ghost" asChild className="justify-start">
                <Link to="/testimonials">Testimonials</Link>
              </Button>

              {user ? (
                <>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link to="/profile">Profile</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={signOut}
                  >
                    Sign Out
                  </Button>
                  <Button asChild className="justify-start">
                    <Link to="/campaigns/create">Start Campaign</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link to="/auth/login">Sign In</Link>
                  </Button>
                  <Button asChild className="justify-start">
                    <Link to="/auth/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
