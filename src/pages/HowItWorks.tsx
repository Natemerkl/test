
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export default function HowItWorks() {
  const navigate = useNavigate();
  const steps = [
    {
      emoji: "✨",
      title: "Create Your Campaign",
      description:
        "Set up your fundraising campaign in minutes. Add a compelling story, photos, and your funding goal.",
    },
    {
      emoji: "🔄",
      title: "Share With Everyone",
      description:
        "Share your campaign with friends, family, and your community through social media and messaging.",
    },
    {
      emoji: "💝",
      title: "Receive Donations",
      description:
        "Watch as supporters contribute to your cause. Track progress and send updates to your donors.",
    },
    {
      emoji: "🎯",
      title: "Achieve Your Goal",
      description:
        "Reach your funding goal and make your project or cause a reality. Impact lives and communities.",
    },
  ];

  const features = [
    "Secure payment processing 🔒",
    "Real-time campaign updates 📊",
    "Mobile-friendly interface 📱",
    "24/7 customer support 💬",
    "Social media integration 🌐",
    "Transparent fee structure 💯",
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">How YegnaBoost Works 🚀</h1>
        <p className="text-lg text-gray-600">
          Join thousands of successful fundraisers who have brought their dreams
          to life
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">{step.emoji}</div>
            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Platform Features 🌟
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 bg-white p-4 rounded-lg"
            >
              <Check className="text-primary h-5 w-5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Start? 🎉</h2>
        <p className="text-lg text-gray-600 mb-8">
          Create your campaign today and start making a difference
        </p>
        <Button
          className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
          onClick={() => navigate("/campaigns/create")}
        >
          Start Your Campaign
        </Button>
      </div>
    </div>
  );
}
