
import { Users, Heart, Globe } from "lucide-react";

export default function About() {
  const stats = [
    {
      emoji: "🎯",
      value: "10K+",
      label: "Successful Campaigns"
    },
    {
      emoji: "💝",
      value: "1M+",
      label: "Total Donations"
    },
    {
      emoji: "🌍",
      value: "50+",
      label: "Cities Reached"
    }
  ];

  const values = [
    {
      icon: Users,
      title: "Community First 🤝",
      description: "We believe in the power of community and collective action to create positive change."
    },
    {
      icon: Heart,
      title: "Transparency & Trust ❤️",
      description: "We maintain complete transparency in our operations and fee structure."
    },
    {
      icon: Globe,
      title: "Local Impact 🌱",
      description: "Supporting Ethiopian causes and helping local communities thrive."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">About YegnaBoost 🚀</h1>
        <p className="text-lg text-gray-600">
          Empowering Ethiopian communities through collective fundraising and support
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-2">{stat.emoji}</div>
            <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Values 💫</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md">
              <value.icon className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Our Mission 🎯</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          To create a platform that empowers Ethiopians to support each other, fund important causes, 
          and build stronger communities through transparent and accessible crowdfunding.
        </p>
        <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
          Join Our Community
        </button>
      </div>
    </div>
  );
}
