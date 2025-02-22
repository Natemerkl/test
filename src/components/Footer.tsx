
import { Link } from "react-router-dom";
import { Heart, Instagram, Facebook, Twitter, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">YegnaBoost 🚀</h3>
            <p className="text-gray-600">
              Empowering Ethiopian dreams through community support
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-600 hover:text-primary cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-600 hover:text-primary cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-600 hover:text-primary cursor-pointer" />
              <Mail className="h-5 w-5 text-gray-600 hover:text-primary cursor-pointer" />
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links 🔗</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/campaigns" className="text-gray-600 hover:text-primary">
                  Browse Campaigns
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-600 hover:text-primary">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Support 💝</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Newsletter ✉️</h3>
            <p className="text-gray-600 mb-4">
              Stay updated with the latest campaigns and news
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 border rounded-lg flex-1"
              />
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center text-gray-600">
          <p>© {currentYear} YegnaBoost. All rights reserved.</p>
          <div className="flex justify-center items-center gap-1 mt-2">
            <span>Made</span>
            
            <span>in Ethiopia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
